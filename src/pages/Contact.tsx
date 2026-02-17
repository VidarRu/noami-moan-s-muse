import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Headphones, Music } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const Contact = () => {
  const { data: c } = useSiteContent("contact");
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

          {/* Contact form (visual only) */}
          <ScrollReveal variant="slideRight" delay={0.3}>
            <form
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <Input
                  placeholder="Ditt namn"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Din e-post"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Ditt meddelande..."
                  rows={5}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-body"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-gold/90 text-primary-foreground hover:bg-gold font-body text-xs tracking-wider uppercase">
                  Skicka Meddelande
                </Button>
              </motion.div>
            </form>
          </ScrollReveal>
        </div>
      </div>

      {/* Footer */}
      <ScrollReveal>
        <footer className="mt-24 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs font-body">
            © 2025 Naomi Moan. Alla rättigheter förbehållna.
          </p>
        </footer>
      </ScrollReveal>
    </section>
  );
};

export default Contact;
