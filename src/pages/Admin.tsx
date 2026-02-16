import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, Save, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ContentRow = {
  id: string;
  page: string;
  section: string;
  content: string;
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
  const [saving, setSaving] = useState<string | null>(null);
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
      supabase
        .from("site_content")
        .select("*")
        .order("page")
        .order("section")
        .then(({ data }) => {
          if (data) setContent(data);
        });
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
  };

  const handleSave = async (row: ContentRow) => {
    setSaving(row.id);
    const { error } = await supabase
      .from("site_content")
      .update({ content: row.content })
      .eq("id", row.id);
    setSaving(null);
    if (error) {
      toast.error("Kunde inte spara: " + error.message);
    } else {
      toast.success("Sparat!");
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
    }
  };

  const updateLocal = (id: string, value: string) => {
    setContent((prev) =>
      prev.map((r) => (r.id === id ? { ...r, content: value } : r))
    );
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
          <h1 className="font-display text-3xl text-gold-gradient text-center mb-6">
            Admin
          </h1>
          {user && !isAdmin && (
            <p className="text-crimson text-sm text-center">
              Du har inte admin-behörighet.
            </p>
          )}
          <Input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            required
          />
          <Input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary border-border"
            required
          />
          <Button
            type="submit"
            className="w-full bg-gold/90 hover:bg-gold text-primary-foreground"
            disabled={authLoading}
          >
            {authLoading ? <Loader2 className="animate-spin" size={16} /> : <LogIn size={16} />}
            Logga in
          </Button>
        </form>
      </section>
    );
  }

  // Group content by page
  const grouped = content.reduce<Record<string, ContentRow[]>>((acc, row) => {
    (acc[row.page] ??= []).push(row);
    return acc;
  }, {});

  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-3xl text-gold-gradient">
            Redigera Innehåll
          </h1>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut size={16} />
            Logga ut
          </Button>
        </div>

        {Object.entries(grouped).map(([page, rows]) => (
          <div key={page} className="mb-12">
            <h2 className="font-display text-xl text-foreground mb-4 border-b border-border pb-2">
              {PAGE_LABELS[page] || page}
            </h2>
            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground font-body mb-1 block">
                      {row.section}
                    </label>
                    {row.content.length > 80 ? (
                      <Textarea
                        value={row.content}
                        onChange={(e) => updateLocal(row.id, e.target.value)}
                        rows={3}
                        className="bg-secondary border-border text-foreground font-body"
                      />
                    ) : (
                      <Input
                        value={row.content}
                        onChange={(e) => updateLocal(row.id, e.target.value)}
                        className="bg-secondary border-border text-foreground font-body"
                      />
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleSave(row)}
                    disabled={saving === row.id}
                    className="mt-5 border-gold/30 text-gold hover:bg-gold/10"
                  >
                    {saving === row.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
