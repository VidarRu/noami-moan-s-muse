import { Headphones, Mail, Instagram, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

const Media = () => {
  const { data: c } = useSiteContent("media");

  const socialLinks = [
    {
      title: "Podcast",
      description: c?.podcast_desc ?? "Lyssna på Noami diskutera romantasy, skrivprocess och bokkaraktärers moraliska gråzoner.",
      icon: Headphones,
      link: "#",
      cta: "Lyssna nu",
      color: "text-crimson-light",
    },
    {
      title: "Substack",
      description: c?.substack_desc ?? "Nyhetsbrev med exklusiva noveller, bakom kulisserna-inblickar och skrivtips.",
      icon: Mail,
      link: "#",
      cta: "Prenumerera",
      color: "text-gold",
    },
    {
      title: "Instagram",
      description: c?.instagram_desc ?? "Estetik, bokinspiration och glimtar från skrivlivet. Följ med bakom kulisserna.",
      icon: Instagram,
      link: "#",
      cta: "Följ",
      color: "text-crimson-light",
    },
    {
      title: "TikTok",
      description: c?.tiktok_desc ?? "BookTok-content, korta berättelser och kreativa skrivutmaningar.",
      icon: Music,
      link: "#",
      cta: "Följ",
      color: "text-gold",
    },
  ];

  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 animate-fade-in-up">
          <p className="text-gold font-serif-accent text-sm tracking-[0.3em] uppercase mb-2">Kanaler</p>
          <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Media & Socialt</h1>
          <div className="w-24 h-px bg-gold/40" />
        </div>

        {/* Social cards */}
        <div className="grid sm:grid-cols-2 gap-8">
          {socialLinks.map((item, i) => (
            <a
              key={item.title}
              href={item.link}
              className="group block border border-border rounded-lg bg-card p-8 hover:border-gold/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
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
          ))}
        </div>

        {/* Podcast embed placeholder */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <h2 className="font-display text-2xl text-foreground mb-6">Senaste Avsnittet</h2>
          <div className="border border-border rounded-lg bg-card p-8 flex items-center justify-center min-h-[120px]">
            <p className="text-muted-foreground font-body text-sm">
              Podcast-embed placeholder – byt ut mot din Spotify/Apple Podcast-embed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Media;
