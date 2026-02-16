const About = () => {
  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 animate-fade-in-up">
          <p className="text-gold font-serif-accent text-sm tracking-[0.3em] uppercase mb-2">Om</p>
          <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Författaren</h1>
          <div className="w-24 h-px bg-gold/40" />
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Portrait placeholder */}
          <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="aspect-[3/4] rounded-lg bg-secondary border border-border flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-body">Författarporträtt</span>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-3 space-y-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-foreground/80 font-body leading-relaxed text-lg">
              Noami Moan är en författare som rör sig i gränslandet mellan fantasy, romantik och det erotiska. 
              Med en förkärlek för mörka, förtrollande världar skapar hon berättelser där magi och passion flätas samman.
            </p>
            <p className="text-foreground/70 font-body leading-relaxed">
              Inspirerad av nordisk folklore, gotisk romantik och moderna fantasy-epos, utforskar Noami mänskliga 
              begär genom fantastiska linser. Hennes prosa är lika sensuell som den är magisk, med karaktärer 
              som kämpar med mörka krafter – både yttre och inre.
            </p>
            <p className="text-foreground/70 font-body leading-relaxed">
              När hon inte skriver kan man hitta henne med näsan i en bok, vandrandes i skog, eller 
              diskuterande bokkaraktärers moraliska gråzoner i sin podcast.
            </p>
          </div>
        </div>

        {/* Pull quote */}
        <div className="mt-20 py-12 border-t border-b border-border text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <blockquote className="font-serif-accent text-2xl md:text-3xl text-foreground/80 italic max-w-2xl mx-auto">
            "I mörkret finner vi inte bara rädslor – vi finner begär vi inte visste att vi hade."
          </blockquote>
          <cite className="block mt-4 text-gold text-sm tracking-widest uppercase font-body not-italic">
            — Noami Moan
          </cite>
        </div>
      </div>
    </section>
  );
};

export default About;
