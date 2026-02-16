import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const books = [
  {
    id: 1,
    title: "Skuggors Kyss",
    type: "Roman",
    genres: ["Dark Fantasy", "Romantik", "Erotik"],
    description: "I ett rike av evigt skymningsljus möts en förbjuden trollkvinna och en fallen riddare. Deras kärlek hotar att krossa den bräckliga freden mellan världarna.",
    longDescription: "När Elara, en trollkvinna vars magi närs av nattens skuggor, möter den landsförvisade riddaren Kael vid den Förbjudna Brunnen, sätts en kedja av händelser igång som ingen av dem kan kontrollera. Deras attraktion är omedelbar, farlig och absolut förbjuden.",
  },
  {
    id: 2,
    title: "Blodrosens Löfte",
    type: "Novell",
    genres: ["Romantasy", "Gothic"],
    description: "En novell om en magisk ros som blommar en gång vart hundrade år – och det pris som måste betalas för att plocka den.",
    longDescription: "I de djupaste delarna av Svartskogen växer en ros vars kronblad skimrar av blod och guld. Legenden säger att den som plockar den får sin djupaste önskan uppfylld – men till ett pris som ingen talar om högt.",
  },
  {
    id: 3,
    title: "Nattens Arvingar",
    type: "Roman",
    genres: ["Fantasy", "Romantik", "Mörk"],
    description: "Tre systrar. Tre gåvor. En profetia som kräver att en av dem offrar allt – inklusive kärleken.",
    longDescription: "Systrarna Ashwyn föddes under en blodig fullmåne, var och en märkt med en unik magisk gåva. Men profetian som omger deras födelse talar om ett val som kommer att splittra dem – och det rike de svurit att skydda.",
  },
  {
    id: 4,
    title: "Förförelsens Flamma",
    type: "Novellsamling",
    genres: ["Erotik", "Fantasy", "Kort"],
    description: "Fem sammanlänkade noveller som utforskar passion, magi och gränsen mellan njutning och fara.",
    longDescription: "Fem berättelser, fem möten där det magiska och det sensuella kolliderar. Från en eldmagiker vars beröring bränner, till en sirenens sång som lovar mer än den borde.",
  },
];

const Works = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section className="min-h-screen py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 animate-fade-in-up">
          <p className="text-gold font-serif-accent text-sm tracking-[0.3em] uppercase mb-2">Bibliotek</p>
          <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Publicerade Verk</h1>
          <div className="w-24 h-px bg-gold/40" />
        </div>

        {/* Books grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {books.map((book, i) => (
            <div
              key={book.id}
              className="group border border-border rounded-lg bg-card hover:border-gold/30 transition-all duration-300 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Book cover placeholder */}
              <div className="aspect-[16/9] bg-secondary flex items-center justify-center border-b border-border">
                <span className="text-muted-foreground text-sm font-body">Bokomslag</span>
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

                {/* Genre tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="text-xs border-gold/30 text-gold/80 font-body"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="text-foreground/70 font-body text-sm leading-relaxed mb-3">
                  {book.description}
                </p>

                {/* Expandable section */}
                <button
                  onClick={() => setExpandedId(expandedId === book.id ? null : book.id)}
                  className="flex items-center gap-1 text-gold text-xs font-body tracking-wider uppercase hover:text-gold-light transition-colors"
                >
                  Läs mer
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform", expandedId === book.id && "rotate-180")}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    expandedId === book.id ? "max-h-40 mt-3" : "max-h-0"
                  )}
                >
                  <p className="text-foreground/60 font-body text-sm leading-relaxed">
                    {book.longDescription}
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
