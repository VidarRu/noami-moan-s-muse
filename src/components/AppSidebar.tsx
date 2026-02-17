import { Home, User, BookOpen, Radio, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Hem", anchor: "hem", icon: Home },
  { title: "Om Författaren", anchor: "om", icon: User },
  { title: "Verk", anchor: "verk", icon: BookOpen },
  { title: "Media", anchor: "media", icon: Radio },
  { title: "Kontakt", anchor: "kontakt", icon: Mail },
];

export function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (anchor: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    }
    if (window.innerWidth < 1024) setExpanded(false);
  };

  return (
    <>
      {/* Mobile toggle button - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-secondary/80 backdrop-blur-sm text-primary hover:bg-secondary transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        {expanded ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {expanded && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          expanded ? "w-56" : "w-0 lg:w-16"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-center h-20 border-b border-border overflow-hidden">
          {expanded ? (
            <span className="text-gold-gradient font-display text-xl font-bold whitespace-nowrap">
              N.M.
            </span>
          ) : (
            <span className="text-gold-gradient font-display text-lg font-bold hidden lg:block">
              N
            </span>
          )}
        </div>

        {/* Desktop toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="hidden lg:flex items-center justify-center h-10 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-hidden">
          {navItems.map((item) => (
            <button
              key={item.anchor}
              onClick={() => scrollToSection(item.anchor)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none w-full text-left"
            >
              <item.icon size={20} className="shrink-0" />
              <span
                className={cn(
                  "text-sm font-body transition-opacity duration-200",
                  expanded ? "opacity-100" : "opacity-0 lg:hidden"
                )}
              >
                {item.title}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer decoration */}
        <div className="p-4 border-t border-border overflow-hidden">
          <div className={cn("text-xs text-muted-foreground font-serif-accent italic text-center", !expanded && "hidden")}>
            Where fantasy meets desire
          </div>
        </div>
      </aside>
    </>
  );
}
