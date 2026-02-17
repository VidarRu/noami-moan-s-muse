import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Headphones, Music, Loader2, CheckCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const { data: c } = useSiteContent("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast.error("Vänligen fyll i alla fält.");
      return;
    }

    if (trimmedName.length > 100 || trimmedEmail.length > 255 || trimmedMessage.length > 2000) {
      toast.error("Ett eller flera fält är för långa.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Ange en giltig e-postadress.");
      return;
    }

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });
    setSending(false);

    if (error) {
      toast.error("Kunde inte skicka meddelandet. Försök igen.");
    } else {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Tack för ditt meddelande!");
    }
  };

  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="text-gold font-serif-accent text-sm tracking-[0.3em] uppercase mb-2">Hör av dig</p>
            <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Kontakt</h1>
            <div className="w-24 h-px bg-gold/40" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <ScrollReveal variant="slideLeft" delay={0.2}>
            <p className="text-foreground/70 font-body leading-relaxed mb-8">
              {c?.intro ?? "Vill du samarbeta, boka en intervju, eller bara säga hej? Hör av dig via formuläret eller mejla direkt."}
            </p>

            <div className="space-y-4">
              <a href={`mailto:${c?.email ?? "hello@naomimoan.com"}`} className="flex items-center gap-3 text-foreground/70 hover:text-gold transition-colors font-body">
                <Mail size={18} className="text-gold" />
                {c?.email ?? "hello@naomimoan.com"}
              </a>
            </div>

            {/* Social icons */}
            <div className="flex gap-4 mt-8">
              {[Instagram, Headphones, Music, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal variant="slideRight" delay={0.3}>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={48} className="text-gold mb-4" />
                <h3 className="font-display text-2xl text-gold-gradient mb-2">Tack!</h3>
                <p className="text-foreground/70 font-body mb-6">Ditt meddelande har skickats. Jag återkommer så snart jag kan.</p>
                <Button
                  variant="outline"
                  onClick={() => setSent(false)}
                  className="border-gold/30 text-gold hover:bg-gold/10 font-body text-xs tracking-wider uppercase"
                >
                  Skicka ett till
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Input
                    placeholder="Ditt namn"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={100}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Din e-post"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    maxLength={255}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Ditt meddelande..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxLength={2000}
                    rows={5}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body"
                    required
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gold/90 text-primary-foreground hover:bg-gold font-body text-xs tracking-wider uppercase"
                  >
                    {sending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                    {sending ? "Skickar..." : "Skicka Meddelande"}
                  </Button>
                </motion.div>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>

      {/* Footer */}
      <ScrollReveal>
        <footer className="mt-24 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs font-body">
            © 2026 Naomi Moan. Alla rättigheter förbehållna.
          </p>
        </footer>
      </ScrollReveal>
    </section>
  );
};

export default Contact;
