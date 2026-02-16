
-- Works table
CREATE TABLE public.works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '',
  genres TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read works" ON public.works FOR SELECT USING (true);
CREATE POLICY "Admins can insert works" ON public.works FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update works" ON public.works FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete works" ON public.works FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works FOR EACH ROW EXECUTE FUNCTION public.update_site_content_updated_at();

-- Storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);

CREATE POLICY "Anyone can view covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Admins can upload covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));

-- Seed works
INSERT INTO public.works (title, type, genres, description, long_description, sort_order) VALUES
  ('Skuggors Kyss', 'Roman', ARRAY['Dark Fantasy', 'Romantik', 'Erotik'], 'I ett rike av evigt skymningsljus möts en förbjuden trollkvinna och en fallen riddare. Deras kärlek hotar att krossa den bräckliga freden mellan världarna.', 'När Elara, en trollkvinna vars magi närs av nattens skuggor, möter den landsförvisade riddaren Kael vid den Förbjudna Brunnen, sätts en kedja av händelser igång som ingen av dem kan kontrollera. Deras attraktion är omedelbar, farlig och absolut förbjuden.', 0),
  ('Blodrosens Löfte', 'Novell', ARRAY['Romantasy', 'Gothic'], 'En novell om en magisk ros som blommar en gång vart hundrade år – och det pris som måste betalas för att plocka den.', 'I de djupaste delarna av Svartskogen växer en ros vars kronblad skimrar av blod och guld. Legenden säger att den som plockar den får sin djupaste önskan uppfylld – men till ett pris som ingen talar om högt.', 1),
  ('Nattens Arvingar', 'Roman', ARRAY['Fantasy', 'Romantik', 'Mörk'], 'Tre systrar. Tre gåvor. En profetia som kräver att en av dem offrar allt – inklusive kärleken.', 'Systrarna Ashwyn föddes under en blodig fullmåne, var och en märkt med en unik magisk gåva. Men profetian som omger deras födelse talar om ett val som kommer att splittra dem – och det rike de svurit att skydda.', 2),
  ('Förförelsens Flamma', 'Novellsamling', ARRAY['Erotik', 'Fantasy', 'Kort'], 'Fem sammanlänkade noveller som utforskar passion, magi och gränsen mellan njutning och fara.', 'Fem berättelser, fem möten där det magiska och det sensuella kolliderar. Från en eldmagiker vars beröring bränner, till en sirenens sång som lovar mer än den borde.', 3);
