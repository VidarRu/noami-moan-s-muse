import heroBg1 from "@/assets/hero-bg-1.jpg";
import heroBg1Hover from "@/assets/hero-bg-1-hover.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [easterEgg, setEasterEgg] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background collage */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0">
        <div
          className="col-span-2 row-span-1 relative cursor-pointer"
          onMouseEnter={() => setEasterEgg(true)}
          onMouseLeave={() => setEasterEgg(false)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{ backgroundImage: `url(${heroBg1})`, opacity: easterEgg ? 0 : 1 }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{ backgroundImage: `url(${heroBg1Hover})`, opacity: easterEgg ? 1 : 0 }}
          />
        </div>
        <div
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg2})` }}
        />
        <div
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg3})` }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/75" />

      {/* Decorative gold line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <p className="text-gold font-serif-accent text-lg md:text-xl tracking-[0.3em] uppercase mb-4 opacity-80">
          Romantasy Author
        </p>
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gold-gradient leading-tight mb-6">
          Noami Moan
        </h1>
        <p className="font-serif-accent text-xl md:text-2xl text-foreground/70 italic max-w-lg mx-auto">
          Where fantasy meets desire
        </p>

        {/* Decorative separator */}
        <div className="flex items-center justify-center gap-4 mt-8 mb-4">
          <div className="w-16 h-px bg-gold/40" />
          <div className="w-2 h-2 rounded-full bg-crimson" />
          <div className="w-16 h-px bg-gold/40" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-fade-in">
        <span className="text-xs tracking-widest uppercase font-body">Utforska</span>
        <ChevronDown size={20} className="animate-bounce" />
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
    </section>
  );
};

export default Index;
