import { useSiteContent } from "@/hooks/useSiteContent";
import { ScrollReveal } from "@/components/ScrollReveal";

const About = () => {
  const { data: c } = useSiteContent("about");
  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="text-gold font-serif-accent text-sm tracking-[0.3em] uppercase mb-2">Om</p>
            <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Författaren</h1>
            <div className="w-24 h-px bg-gold/40" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Portrait placeholder */}
          <ScrollReveal variant="slideLeft" delay={0.2} className="md:col-span-2">
            <div className="aspect-[3/4] rounded-lg bg-secondary border border-border flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-body">Författarporträtt</span>
            </div>
          </ScrollReveal>

          {/* Bio */}
          <ScrollReveal variant="slideRight" delay={0.3} className="md:col-span-3">
            <div className="space-y-6">
              <p className="text-foreground/80 font-body leading-relaxed text-lg">
                {c?.bio_1 ?? "Naomi Moan är en författare som rör sig i gränslandet mellan fantasy, romantik och det erotiska. Med en förkärlek för mörka, förtrollande världar skapar hon berättelser där magi och passion flätas samman."}
              </p>
              <p className="text-foreground/70 font-body leading-relaxed">
                {c?.bio_2 ?? "Inspirerad av nordisk folklore, gotisk romantik och moderna fantasy-epos, utforskar Naomi mänskliga begär genom fantastiska linser. Hennes prosa är lika sensuell som den är magisk, med karaktärer som kämpar med mörka krafter – både yttre och inre."}
              </p>
              <p className="text-foreground/70 font-body leading-relaxed">
                {c?.bio_3 ?? "När hon inte skriver kan man hitta henne med näsan i en bok, vandrandes i skog, eller diskuterande bokkaraktärers moraliska gråzoner i sin podcast."}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Pull quote */}
        <ScrollReveal variant="scaleIn" delay={0.2}>
          <div className="mt-20 py-12 border-t border-b border-border text-center">
            <blockquote className="font-serif-accent text-2xl md:text-3xl text-foreground/80 italic max-w-2xl mx-auto">
              "{c?.quote ?? "I mörkret finner vi inte bara rädslor – vi finner begär vi inte visste att vi hade."}"
            </blockquote>
            <cite className="block mt-4 text-gold text-sm tracking-widest uppercase font-body not-italic">
              — Naomi Moan
            </cite>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
