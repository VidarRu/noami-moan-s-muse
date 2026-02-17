import heroBg1 from "@/assets/hero-bg-1.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import { ChevronDown } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

const TROPES = [
  "\"There's only one bed…\"",
  "\"Who did this to you?\"",
  "\"You're mine.\"",
  "\"Is that my shirt?\"",
  "\"Don't look down…\" *looks down*",
  "\"We need to share body heat.\"",
  "\"I would burn the world for you.\"",
];

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

const Index = () => {
  const { data: c } = useSiteContent("index");
  const [petals, setPetals] = useState<Petal[]>([]);
  const [tropeText, setTropeText] = useState<string | null>(null);

  const spawnPetals = useCallback(() => {
    const newPetals: Petal[] = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2.5 + Math.random() * 3,
      size: 20 + Math.random() * 24,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
    setTimeout(() => setPetals([]), 5000);
  }, []);

  const toggleTrope = useCallback(() => {
    if (tropeText) {
      setTropeText(null);
    } else {
      setTropeText(TROPES[Math.floor(Math.random() * TROPES.length)]);
    }
  }, [tropeText]);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background collage */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0">
        <motion.div
          className="col-span-2 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg1})` }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg2})` }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />
        <motion.div
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg3})` }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/75" />

      {/* Decorative gold line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.p
          className="text-gold font-serif-accent text-lg md:text-xl tracking-[0.3em] uppercase mb-4 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {c?.subtitle ?? "Romantasy Author"}
        </motion.p>
        <motion.h1
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gold-gradient leading-tight mb-6 cursor-pointer select-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={spawnPetals}
          title="✨"
        >
          {c?.title ?? "Naomi Moan"}
        </motion.h1>
        <motion.p
          className="font-serif-accent text-xl md:text-2xl text-foreground/70 italic max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {c?.tagline ?? "Where fantasy meets desire"}
        </motion.p>

        {/* Decorative separator */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-8 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <div className="w-16 h-px bg-gold/40" />
          <div
            className="relative w-3 h-3 rounded-full bg-crimson cursor-pointer transition-all duration-300 hover:scale-[3] hover:shadow-[0_0_16px_hsl(var(--crimson))]"
            onClick={toggleTrope}
          />
          <div className="w-16 h-px bg-gold/40" />
        </motion.div>

        {/* Easter egg: trope quote */}
        <AnimatePresence>
          {tropeText && (
            <motion.p
              className="font-serif-accent text-2xl md:text-3xl italic text-crimson/90 mt-4"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {tropeText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Easter egg: falling rose petals */}
      <AnimatePresence>
        {petals.map((p) => (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none z-20"
            style={{ left: `${p.x}%`, top: -20, fontSize: p.size }}
            initial={{ opacity: 1, y: -20, rotate: p.rotation }}
            animate={{
              y: "110vh",
              rotate: p.rotation + 360,
              x: [0, 30, -20, 10],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeIn",
            }}
          >
            🌹
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <button
          onClick={() => document.getElementById("om")?.scrollIntoView({ behavior: "smooth" })}
          className="text-xs tracking-widest uppercase font-body cursor-pointer bg-transparent border-none text-muted-foreground"
        >
          Utforska
        </button>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.div>

      {/* Bottom gold line */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.7 }}
      />
    </section>
  );
};

export default Index;
