
-- Content table for editable site content
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read content
CREATE POLICY "Public can read site content"
  ON public.site_content FOR SELECT
  USING (true);

-- Only admins can modify content
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only admins can update site content
CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed default content
INSERT INTO public.site_content (id, page, section, content) VALUES
  ('index_subtitle', 'index', 'subtitle', 'Romantasy Author'),
  ('index_title', 'index', 'title', 'Noami Moan'),
  ('index_tagline', 'index', 'tagline', 'Where fantasy meets desire'),
  ('about_bio_1', 'about', 'bio_1', 'Noami Moan är en författare som rör sig i gränslandet mellan fantasy, romantik och det erotiska. Med en förkärlek för mörka, förtrollande världar skapar hon berättelser där magi och passion flätas samman.'),
  ('about_bio_2', 'about', 'bio_2', 'Inspirerad av nordisk folklore, gotisk romantik och moderna fantasy-epos, utforskar Noami mänskliga begär genom fantastiska linser. Hennes prosa är lika sensuell som den är magisk, med karaktärer som kämpar med mörka krafter – både yttre och inre.'),
  ('about_bio_3', 'about', 'bio_3', 'När hon inte skriver kan man hitta henne med näsan i en bok, vandrandes i skog, eller diskuterande bokkaraktärers moraliska gråzoner i sin podcast.'),
  ('about_quote', 'about', 'quote', 'I mörkret finner vi inte bara rädslor – vi finner begär vi inte visste att vi hade.'),
  ('contact_intro', 'contact', 'intro', 'Vill du samarbeta, boka en intervju, eller bara säga hej? Hör av dig via formuläret eller mejla direkt.'),
  ('contact_email', 'contact', 'email', 'hello@noamimoan.com'),
  ('media_podcast_desc', 'media', 'podcast_desc', 'Lyssna på Noami diskutera romantasy, skrivprocess och bokkaraktärers moraliska gråzoner.'),
  ('media_substack_desc', 'media', 'substack_desc', 'Nyhetsbrev med exklusiva noveller, bakom kulisserna-inblickar och skrivtips.'),
  ('media_instagram_desc', 'media', 'instagram_desc', 'Estetik, bokinspiration och glimtar från skrivlivet. Följ med bakom kulisserna.'),
  ('media_tiktok_desc', 'media', 'tiktok_desc', 'BookTok-content, korta berättelser och kreativa skrivutmaningar.');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_site_content_updated_at();
