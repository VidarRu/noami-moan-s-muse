import { Headphones, Mail, Instagram, Music, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

const platformIcons: Record<string, typeof Headphones> = {
  podcast: Headphones,
  substack: Mail,
  instagram: Instagram,
  tiktok: Music,
};

const platformColors: Record<string, string> = {
  podcast: "text-crimson-light",
  substack: "text-gold",
  instagram: "text-crimson-light",
  tiktok: "text-gold",
};

const Media = () => {
  const { data: c } = useSiteContent("media");

  const { data: posts = [] } = useQuery({
    queryKey: ["media_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const socialLinks = [
    {
      title: "Podcast",
      description: c?.podcast_desc ?? "Lyssna på Noami diskutera romantasy, skrivprocess och bokkaraktärers moraliska gråzoner.",
      icon: Headphones,
      link: "#",
      cta: "Lyssna nu",
      color: "text-crimson-light",
      platform: "podcast",
    },
    {
      title: "Substack",
      description: c?.substack_desc ?? "Nyhetsbrev med exklusiva noveller, bakom kulisserna-inblickar och skrivtips.",
      icon: Mail,
      link: "#",
      cta: "Prenumerera",
      color: "text-gold",
      platform: "substack",
    },
    {
      title: "Instagram",
      description: c?.instagram_desc ?? "Estetik, bokinspiration och glimtar från skrivlivet. Följ med bakom kulisserna.",
      icon: Instagram,
      link: "#",
      cta: "Följ",
      color: "text-crimson-light",
      platform: "instagram",
    },
    {
      title: "TikTok",
      description: c?.tiktok_desc ?? "BookTok-content, korta berättelser och kreativa skrivutmaningar.",
      icon: Music,
      link: "#",
      cta: "Följ",
      color: "text-gold",
      platform: "tiktok",
    },
  ];

  // Group posts by platform
  const postsByPlatform = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    if (!acc[post.platform]) acc[post.platform] = [];
    acc[post.platform].push(post);
    return acc;
  }, {});

  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="text-gold font-serif-accent text-sm tracking-[0.3em] uppercase mb-2">Kanaler</p>
            <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Media & Socialt</h1>
            <div className="w-24 h-px bg-gold/40" />
          </div>
        </ScrollReveal>

        {/* Social cards */}
        <StaggerContainer className="grid sm:grid-cols-2 gap-8" staggerDelay={0.15}>
          {socialLinks.map((item) => {
            const platformPosts = postsByPlatform[item.platform] || [];
            return (
              <StaggerItem key={item.title}>
                <motion.div
                  className="group border border-border rounded-lg bg-card hover:border-gold/30 transition-colors duration-300"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <a href={item.link} className="block p-8">
                    <item.icon size={32} className={`${item.color} mb-4`} />
                    <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-gold-gradient transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-foreground/60 font-body text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <Button
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold font-body text-xs tracking-wider uppercase"
                    >
                      {item.cta}
                    </Button>
                  </a>

                  {/* Recent posts from this platform */}
                  {platformPosts.length > 0 && (
                    <div className="border-t border-border px-8 py-4 space-y-3">
                      <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Senaste</p>
                      {platformPosts.slice(0, 3).map((post) => {
                        const Icon = platformIcons[post.platform] || Mail;
                        return (
                          <a
                            key={post.id}
                            href={post.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 group/post"
                          >
                            {post.image_url && (
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-foreground/80 font-body truncate group-hover/post:text-gold transition-colors">
                                {post.title}
                              </p>
                              {post.published_at && (
                                <p className="text-xs text-muted-foreground font-body">
                                  {format(new Date(post.published_at), "d MMM yyyy", { locale: sv })}
                                </p>
                              )}
                            </div>
                            <ExternalLink size={12} className="text-muted-foreground flex-shrink-0 mt-1" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* All recent posts feed */}
        {posts.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="mt-16">
              <h2 className="font-display text-2xl text-foreground mb-6">Senaste Inläggen</h2>
              <div className="space-y-4">
                {posts.slice(0, 10).map((post) => {
                  const Icon = platformIcons[post.platform] || Mail;
                  const color = platformColors[post.platform] || "text-gold";
                  return (
                    <motion.a
                      key={post.id}
                      href={post.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 border border-border rounded-lg bg-card p-4 hover:border-gold/30 transition-colors"
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    >
                      <Icon size={20} className={color} />
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-body text-sm truncate">{post.title}</p>
                        <p className="text-foreground/50 font-body text-xs truncate">{post.description}</p>
                      </div>
                      {post.published_at && (
                        <span className="text-xs text-muted-foreground font-body flex-shrink-0">
                          {format(new Date(post.published_at), "d MMM", { locale: sv })}
                        </span>
                      )}
                      <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Podcast embed placeholder (shown when no posts) */}
        {posts.length === 0 && (
          <ScrollReveal delay={0.3}>
            <div className="mt-16">
              <h2 className="font-display text-2xl text-foreground mb-6">Senaste Avsnittet</h2>
              <div className="border border-border rounded-lg bg-card p-8 flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground font-body text-sm">
                  Inga inlägg ännu – koppla dina kanaler för att importera innehåll automatiskt
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default Media;
