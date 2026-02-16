import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Works = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: books = [] } = useQuery({
    queryKey: ["works"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 animate-fade-in-up">
          <p className="text-gold font-serif-accent text-sm tracking-[0.3em] uppercase mb-2">Bibliotek</p>
          <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Publicerade Verk</h1>
          <div className="w-24 h-px bg-gold/40" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {books.map((book, i) => (
            <div
              key={book.id}
              className="group border border-border rounded-lg bg-card hover:border-gold/30 transition-all duration-300 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="aspect-[16/9] bg-secondary flex items-center justify-center border-b border-border overflow-hidden">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted-foreground text-sm font-body">Bokomslag</span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display text-xl text-foreground group-hover:text-gold-gradient transition-colors">
                      {book.title}
                    </h3>
                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      {book.type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {book.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs border-gold/30 text-gold/80 font-body">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="text-foreground/70 font-body text-sm leading-relaxed mb-3">
                  {book.description}
                </p>

                <button
                  onClick={() => setExpandedId(expandedId === book.id ? null : book.id)}
                  className="flex items-center gap-1 text-gold text-xs font-body tracking-wider uppercase hover:text-gold-light transition-colors"
                >
                  Läs mer
                  <ChevronDown size={14} className={cn("transition-transform", expandedId === book.id && "rotate-180")} />
                </button>

                <div className={cn("overflow-hidden transition-all duration-300", expandedId === book.id ? "max-h-40 mt-3" : "max-h-0")}>
                  <p className="text-foreground/60 font-body text-sm leading-relaxed">
                    {book.long_description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Works;
