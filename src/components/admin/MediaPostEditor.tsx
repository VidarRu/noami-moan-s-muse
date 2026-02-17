import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MediaPost = {
  id: string;
  platform: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  published_at: string | null;
  external_id: string | null;
};

const PLATFORMS = [
  { value: "podcast", label: "Podcast" },
  { value: "substack", label: "Substack" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "other", label: "Övrigt" },
];

interface MediaPostEditorProps {
  post: MediaPost;
  saving: boolean;
  onSave: () => void;
  onDelete: () => void;
  onChange: (field: keyof MediaPost, value: any) => void;
}

export function MediaPostEditor({ post, saving, onSave, onDelete, onChange }: MediaPostEditorProps) {
  return (
    <div className="border border-border rounded-lg bg-card p-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Titel</label>
          <Input value={post.title} onChange={e => onChange("title", e.target.value)} className="bg-secondary border-border text-foreground font-body" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Plattform</label>
          <Select value={post.platform} onValueChange={v => onChange("platform", v)}>
            <SelectTrigger className="bg-secondary border-border text-foreground font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground font-body mb-1 block">Beskrivning</label>
        <Textarea value={post.description} onChange={e => onChange("description", e.target.value)} rows={2} className="bg-secondary border-border text-foreground font-body" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">URL</label>
          <Input value={post.url} onChange={e => onChange("url", e.target.value)} className="bg-secondary border-border text-foreground font-body" placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Bild-URL (valfritt)</label>
          <Input value={post.image_url || ""} onChange={e => onChange("image_url", e.target.value || null)} className="bg-secondary border-border text-foreground font-body" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground font-body mb-1 block">Publiceringsdatum (valfritt)</label>
        <Input
          type="datetime-local"
          value={post.published_at ? post.published_at.slice(0, 16) : ""}
          onChange={e => onChange("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="bg-secondary border-border text-foreground font-body"
        />
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
