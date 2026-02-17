import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface FeedItem {
  platform: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  published_at: string | null;
  external_id: string;
}

function extractText(xml: string, tag: string): string {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  const match = xml.match(regex);
  return match ? match[1] : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function parseRssFeed(xml: string, platform: string): FeedItem[] {
  const items: FeedItem[] = [];

  // Check if it's Atom feed
  const isAtom = xml.includes("<feed") && xml.includes("xmlns=\"http://www.w3.org/2005/Atom\"");

  if (isAtom) {
    const entryRegex = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];
      const title = stripHtml(extractText(entry, "title"));
      const description = stripHtml(extractText(entry, "summary") || extractText(entry, "content"));
      const link = extractAttr(entry, "link", "href") || extractText(entry, "link");
      const published = extractText(entry, "published") || extractText(entry, "updated");
      const id = extractText(entry, "id") || link;
      const imageUrl = extractAttr(entry, "media:thumbnail", "url") || extractAttr(entry, "media:content", "url") || null;

      if (title && link) {
        items.push({
          platform,
          title: title.substring(0, 500),
          description: description.substring(0, 2000),
          url: link,
          image_url: imageUrl,
          published_at: published ? new Date(published).toISOString() : null,
          external_id: id || link,
        });
      }
    }
  } else {
    // RSS 2.0
    const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const title = stripHtml(extractText(item, "title"));
      const description = stripHtml(extractText(item, "description") || extractText(item, "content:encoded"));
      const link = extractText(item, "link");
      const pubDate = extractText(item, "pubDate");
      const guid = extractText(item, "guid") || link;
      const imageUrl = extractAttr(item, "itunes:image", "href")
        || extractAttr(item, "media:content", "url")
        || extractAttr(item, "enclosure", "url")
        || null;

      if (title && link) {
        items.push({
          platform,
          title: title.substring(0, 500),
          description: description.substring(0, 2000),
          url: link,
          image_url: imageUrl,
          published_at: pubDate ? new Date(pubDate).toISOString() : null,
          external_id: guid || link,
        });
      }
    }
  }

  return items;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub as string;
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { feeds } = await req.json() as {
      feeds: { url: string; platform: string }[];
    };

    if (!feeds || !Array.isArray(feeds) || feeds.length === 0) {
      return new Response(JSON.stringify({ error: "No feeds provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let totalImported = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    // Use service role for inserts (bypasses RLS)
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    for (const feed of feeds) {
      try {
        console.log(`Fetching RSS: ${feed.url}`);
        const response = await fetch(feed.url, {
          headers: { "User-Agent": "NaomiMoan-RSS-Importer/1.0" },
        });

        if (!response.ok) {
          errors.push(`${feed.platform}: HTTP ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const items = parseRssFeed(xml, feed.platform);
        console.log(`Parsed ${items.length} items from ${feed.platform}`);

        for (const item of items) {
          // Check if already exists
          if (item.external_id) {
            const { data: existing } = await adminSupabase
              .from("media_posts")
              .select("id")
              .eq("platform", item.platform)
              .eq("external_id", item.external_id)
              .maybeSingle();

            if (existing) {
              totalSkipped++;
              continue;
            }
          }

          const { error: insertError } = await adminSupabase
            .from("media_posts")
            .insert(item);

          if (insertError) {
            console.error(`Insert error: ${insertError.message}`);
            totalSkipped++;
          } else {
            totalImported++;
          }
        }
      } catch (feedError) {
        const msg = feedError instanceof Error ? feedError.message : "Unknown error";
        errors.push(`${feed.platform}: ${msg}`);
        console.error(`Feed error (${feed.platform}):`, msg);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: totalImported,
        skipped: totalSkipped,
        errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("RSS import error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
