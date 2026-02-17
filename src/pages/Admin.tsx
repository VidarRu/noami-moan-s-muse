import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, Save, LogOut, Loader2, Plus, Trash2, Eye, EyeOff, Mail, Rss, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { WorkEditor, type Work } from "@/components/admin/WorkEditor";
import { MediaPostEditor, type MediaPost } from "@/components/admin/MediaPostEditor";

type ContentRow = {
  id: string;
  page: string;
  section: string;
  content: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

const PAGE_LABELS: Record<string, string> = {
  index: "Startsida",
  about: "Om Författaren",
  media: "Media",
  contact: "Kontakt",
};

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [content, setContent] = useState<ContentRow[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [mediaPosts, setMediaPosts] = useState<MediaPost[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [rssFeeds, setRssFeeds] = useState([
    { url: "", platform: "podcast" },
  ]);
  const [importing, setImporting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", u.id)
            .eq("role", "admin")
            .maybeSingle();
          setIsAdmin(!!data);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );
    supabase.auth.getSession();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("site_content").select("*").order("page").order("section")
        .then(({ data }) => { if (data) setContent(data); });
      supabase.from("works").select("*").order("sort_order")
        .then(({ data }) => { if (data) setWorks(data); });
      supabase.from("media_posts").select("*").order("published_at", { ascending: false, nullsFirst: false })
        .then(({ data }) => { if (data) setMediaPosts(data as MediaPost[]); });
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setContactMessages(data as ContactMessage[]); });
    }
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) toast.error(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setContent([]);
    setWorks([]);
    setMediaPosts([]);
    setContactMessages([]);
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    const { error } = await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    if (error) toast.error(error.message);
    else setContactMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: !m.read } : m));
  };

  const handleDeleteMessage = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setContactMessages(prev => prev.filter(m => m.id !== id)); toast.success("Meddelande borttaget!"); }
  };

  const handleRssImport = async () => {
    const validFeeds = rssFeeds.filter(f => f.url.trim());
    if (validFeeds.length === 0) {
      toast.error("Ange minst en RSS-URL.");
      return;
    }
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("rss-import", {
        body: { feeds: validFeeds },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(`Importerade ${data.imported} inlägg (${data.skipped} överhoppade).`);
        if (data.errors?.length) {
          data.errors.forEach((e: string) => toast.error(e));
        }
        // Refresh media posts
        const { data: refreshed } = await supabase.from("media_posts").select("*").order("published_at", { ascending: false, nullsFirst: false });
        if (refreshed) setMediaPosts(refreshed as MediaPost[]);
        queryClient.invalidateQueries({ queryKey: ["media_posts"] });
      } else {
        toast.error(data?.error || "Import misslyckades.");
      }
    } catch (err: any) {
      toast.error(err.message || "Import misslyckades.");
    }
    setImporting(false);
  };


  const handleSaveContent = async (row: ContentRow) => {
    setSaving(row.id);
    const { error } = await supabase.from("site_content").update({ content: row.content }).eq("id", row.id);
    setSaving(null);
    if (error) toast.error("Kunde inte spara: " + error.message);
    else { toast.success("Sparat!"); queryClient.invalidateQueries({ queryKey: ["site_content"] }); }
  };

  // Works handlers
  const handleSaveWork = async (work: Work) => {
    setSaving(work.id);
    const { error } = await supabase.from("works").update({
      title: work.title, type: work.type, genres: work.genres,
      description: work.description, long_description: work.long_description,
      cover_url: work.cover_url, sort_order: work.sort_order,
    }).eq("id", work.id);
    setSaving(null);
    if (error) toast.error("Kunde inte spara: " + error.message);
    else { toast.success("Verk sparat!"); queryClient.invalidateQueries({ queryKey: ["works"] }); }
  };

  const handleAddWork = async () => {
    const { data, error } = await supabase.from("works").insert({
      title: "Nytt Verk", type: "Roman", genres: [], description: "", long_description: "", sort_order: works.length,
    }).select().single();
    if (error) toast.error(error.message);
    else if (data) { setWorks([...works, data]); toast.success("Nytt verk tillagt!"); queryClient.invalidateQueries({ queryKey: ["works"] }); }
  };

  const handleDeleteWork = async (id: string) => {
    const { error } = await supabase.from("works").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setWorks(works.filter(w => w.id !== id)); toast.success("Verk borttaget!"); queryClient.invalidateQueries({ queryKey: ["works"] }); }
  };

  const handleCoverUpload = async (workId: string, file: File) => {
    setUploadingId(workId);
    const ext = file.name.split(".").pop();
    const path = `${workId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
    if (uploadError) { toast.error(uploadError.message); setUploadingId(null); return; }
    const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(path);
    const { error } = await supabase.from("works").update({ cover_url: publicUrl }).eq("id", workId);
    setUploadingId(null);
    if (error) toast.error(error.message);
    else {
      setWorks(works.map(w => w.id === workId ? { ...w, cover_url: publicUrl } : w));
      toast.success("Omslag uppladdat!");
      queryClient.invalidateQueries({ queryKey: ["works"] });
    }
  };

  // Media posts handlers
  const handleSaveMediaPost = async (post: MediaPost) => {
    setSaving(post.id);
    const { error } = await supabase.from("media_posts").update({
      platform: post.platform, title: post.title, description: post.description,
      url: post.url, image_url: post.image_url, published_at: post.published_at,
    }).eq("id", post.id);
    setSaving(null);
    if (error) toast.error("Kunde inte spara: " + error.message);
    else { toast.success("Inlägg sparat!"); queryClient.invalidateQueries({ queryKey: ["media_posts"] }); }
  };

  const handleAddMediaPost = async () => {
    const { data, error } = await supabase.from("media_posts").insert({
      platform: "podcast", title: "Nytt inlägg", description: "", url: "",
    }).select().single();
    if (error) toast.error(error.message);
    else if (data) { setMediaPosts([data as MediaPost, ...mediaPosts]); toast.success("Nytt inlägg tillagt!"); queryClient.invalidateQueries({ queryKey: ["media_posts"] }); }
  };

  const handleDeleteMediaPost = async (id: string) => {
    const { error } = await supabase.from("media_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setMediaPosts(mediaPosts.filter(p => p.id !== id)); toast.success("Inlägg borttaget!"); queryClient.invalidateQueries({ queryKey: ["media_posts"] }); }
  };

  const updateContent = (id: string, value: string) => {
    setContent(prev => prev.map(r => r.id === id ? { ...r, content: value } : r));
  };

  const updateWork = (id: string, field: keyof Work, value: any) => {
    setWorks(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const updateMediaPost = (id: string, field: keyof MediaPost, value: any) => {
    setMediaPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="font-display text-3xl text-gold-gradient text-center mb-6">Admin</h1>
          {user && !isAdmin && <p className="text-crimson text-sm text-center">Du har inte admin-behörighet.</p>}
          <Input type="email" placeholder="E-post" value={email} onChange={e => setEmail(e.target.value)} className="bg-secondary border-border" required />
          <Input type="password" placeholder="Lösenord" value={password} onChange={e => setPassword(e.target.value)} className="bg-secondary border-border" required />
          <Button type="submit" className="w-full bg-gold/90 hover:bg-gold text-primary-foreground" disabled={authLoading}>
            {authLoading ? <Loader2 className="animate-spin" size={16} /> : <LogIn size={16} />}
            Logga in
          </Button>
        </form>
      </section>
    );
  }

  const grouped = content.reduce<Record<string, ContentRow[]>>((acc, row) => {
    (acc[row.page] ??= []).push(row);
    return acc;
  }, {});

  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-3xl text-gold-gradient">Redigera Innehåll</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut size={16} /> Logga ut
          </Button>
        </div>

        {/* Site content */}
        {Object.entries(grouped).map(([page, rows]) => (
          <div key={page} className="mb-12">
            <h2 className="font-display text-xl text-foreground mb-4 border-b border-border pb-2">
              {PAGE_LABELS[page] || page}
            </h2>
            <div className="space-y-4">
              {rows.map(row => (
                <div key={row.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground font-body mb-1 block">{row.section}</label>
                    {row.content.length > 80 ? (
                      <Textarea value={row.content} onChange={e => updateContent(row.id, e.target.value)} rows={3} className="bg-secondary border-border text-foreground font-body" />
                    ) : (
                      <Input value={row.content} onChange={e => updateContent(row.id, e.target.value)} className="bg-secondary border-border text-foreground font-body" />
                    )}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => handleSaveContent(row)} disabled={saving === row.id} className="mt-5 border-gold/30 text-gold hover:bg-gold/10">
                    {saving === row.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Works */}
        <div className="mb-12">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h2 className="font-display text-xl text-foreground">Verk</h2>
            <Button size="sm" variant="outline" onClick={handleAddWork} className="border-gold/30 text-gold hover:bg-gold/10">
              <Plus size={14} /> Lägg till
            </Button>
          </div>
          <div className="space-y-8">
            {works.map(work => (
              <WorkEditor
                key={work.id}
                work={work}
                saving={saving === work.id}
                uploading={uploadingId === work.id}
                onSave={() => handleSaveWork(work)}
                onDelete={() => handleDeleteWork(work.id)}
                onChange={(field, value) => updateWork(work.id, field, value)}
                onUploadCover={(file) => handleCoverUpload(work.id, file)}
              />
            ))}
          </div>
        </div>

        {/* RSS Import */}
        <div className="mb-12">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Rss size={20} className="text-gold" />
              RSS-import
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRssImport}
              disabled={importing}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              {importing ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
              {importing ? "Importerar..." : "Importera nu"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-4">
            Ange RSS-flödes-URL:er för att automatiskt importera inlägg till Media-sidan. Dubbletter hoppas över automatiskt.
          </p>
          <div className="space-y-3">
            {rssFeeds.map((feed, i) => (
              <div key={i} className="flex gap-3 items-center">
                <select
                  value={feed.platform}
                  onChange={e => setRssFeeds(prev => prev.map((f, j) => j === i ? { ...f, platform: e.target.value } : f))}
                  className="bg-secondary border border-border rounded-md px-3 py-2 text-foreground font-body text-sm w-32"
                >
                  <option value="podcast">Podcast</option>
                  <option value="substack">Substack</option>
                  <option value="youtube">YouTube</option>
                  <option value="blog">Blogg</option>
                </select>
                <Input
                  value={feed.url}
                  onChange={e => setRssFeeds(prev => prev.map((f, j) => j === i ? { ...f, url: e.target.value } : f))}
                  placeholder="https://example.com/feed.xml"
                  className="bg-secondary border-border text-foreground font-body flex-1"
                />
                {rssFeeds.length > 1 && (
                  <Button size="icon" variant="ghost" onClick={() => setRssFeeds(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setRssFeeds(prev => [...prev, { url: "", platform: "podcast" }])}
              className="text-muted-foreground hover:text-gold text-xs"
            >
              <Plus size={14} /> Lägg till flöde
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h2 className="font-display text-xl text-foreground">Media-inlägg</h2>
            <Button size="sm" variant="outline" onClick={handleAddMediaPost} className="border-gold/30 text-gold hover:bg-gold/10">
              <Plus size={14} /> Lägg till
            </Button>
          </div>
          <div className="space-y-6">
            {mediaPosts.map(post => (
              <MediaPostEditor
                key={post.id}
                post={post}
                saving={saving === post.id}
                onSave={() => handleSaveMediaPost(post)}
                onDelete={() => handleDeleteMediaPost(post.id)}
                onChange={(field, value) => updateMediaPost(post.id, field, value)}
              />
            ))}
            {mediaPosts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Inga media-inlägg ännu. Klicka "Lägg till" för att skapa ett.</p>
            )}
          </div>
        </div>

        {/* Contact Messages */}
        <div className="mb-12">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Mail size={20} className="text-gold" />
              Kontaktmeddelanden
              {contactMessages.filter(m => !m.read).length > 0 && (
                <span className="text-xs bg-crimson text-accent-foreground px-2 py-0.5 rounded-full">
                  {contactMessages.filter(m => !m.read).length} nya
                </span>
              )}
            </h2>
          </div>
          <div className="space-y-3">
            {contactMessages.map(msg => (
              <div key={msg.id} className={`p-4 rounded-lg border ${msg.read ? 'border-border bg-secondary/50' : 'border-gold/30 bg-secondary'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body font-medium text-foreground">{msg.name}</span>
                      <a href={`mailto:${msg.email}`} className="text-xs text-gold hover:underline font-body">{msg.email}</a>
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-crimson shrink-0" />}
                    </div>
                    <p className="text-foreground/70 font-body text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-body">
                      {new Date(msg.created_at).toLocaleString("sv-SE")}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => handleToggleRead(msg)} className="text-muted-foreground hover:text-gold" title={msg.read ? "Markera som oläst" : "Markera som läst"}>
                      {msg.read ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteMessage(msg.id)} className="text-muted-foreground hover:text-destructive" title="Ta bort">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {contactMessages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Inga kontaktmeddelanden ännu.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
