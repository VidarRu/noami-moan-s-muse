
-- Table for media posts imported from external platforms
CREATE TABLE public.media_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL, -- 'podcast', 'substack', 'instagram', 'tiktok'
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  image_url text,
  published_at timestamp with time zone,
  external_id text, -- ID from the source platform
  metadata jsonb DEFAULT '{}'::jsonb, -- flexible field for platform-specific data
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prevent duplicate imports
CREATE UNIQUE INDEX idx_media_posts_external ON public.media_posts (platform, external_id) WHERE external_id IS NOT NULL;

-- For ordering
CREATE INDEX idx_media_posts_platform_date ON public.media_posts (platform, published_at DESC);

ALTER TABLE public.media_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media posts"
  ON public.media_posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert media posts"
  ON public.media_posts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update media posts"
  ON public.media_posts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete media posts"
  ON public.media_posts FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Timestamp trigger
CREATE TRIGGER update_media_posts_updated_at
  BEFORE UPDATE ON public.media_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_site_content_updated_at();
