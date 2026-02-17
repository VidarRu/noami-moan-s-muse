import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Loader2, ImagePlus } from "lucide-react";

export type Work = {
  id: string;
  title: string;
  type: string;
  genres: string[];
  description: string;
  long_description: string;
  cover_url: string | null;
  sort_order: number;
};

interface WorkEditorProps {
  work: Work;
  saving: boolean;
  uploading: boolean;
  onSave: () => void;
  onDelete: () => void;
  onChange: (field: keyof Work, value: any) => void;
  onUploadCover: (file: File) => void;
}

export function WorkEditor({ work, saving, uploading, onSave, onDelete, onChange, onUploadCover }: WorkEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-border rounded-lg bg-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-28 shrink-0">
          <div
            className="aspect-[3/4] bg-secondary rounded border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gold/40 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="animate-spin text-gold" size={20} />
            ) : work.cover_url ? (
              <img src={work.cover_url} alt={work.title} className="w-full h-full object-cover" />
            ) : (
              <ImagePlus size={20} className="text-muted-foreground" />
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onUploadCover(e.target.files[0]); }} />
          <p className="text-[10px] text-muted-foreground text-center mt-1">Klicka för omslag</p>
        </div>

        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-body mb-1 block">Titel</label>
              <Input value={work.title} onChange={e => onChange("title", e.target.value)} className="bg-secondary border-border text-foreground font-body" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-body mb-1 block">Typ</label>
              <Input value={work.type} onChange={e => onChange("type", e.target.value)} className="bg-secondary border-border text-foreground font-body" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1 block">Genrer (komma-separerade)</label>
            <Input value={work.genres.join(", ")} onChange={e => onChange("genres", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="bg-secondary border-border text-foreground font-body" />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground font-body mb-1 block">Kort beskrivning</label>
        <Textarea value={work.description} onChange={e => onChange("description", e.target.value)} rows={2} className="bg-secondary border-border text-foreground font-body" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-body mb-1 block">Lång beskrivning</label>
        <Textarea value={work.long_description} onChange={e => onChange("long_description", e.target.value)} rows={3} className="bg-secondary border-border text-foreground font-body" />
      </div>

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-crimson hover:text-crimson-light">
          <Trash2 size={14} /> Ta bort
        </Button>
        <Button size="sm" variant="outline" onClick={onSave} disabled={saving} className="border-gold/30 text-gold hover:bg-gold/10">
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Spara
        </Button>
      </div>
    </div>
  );
}
