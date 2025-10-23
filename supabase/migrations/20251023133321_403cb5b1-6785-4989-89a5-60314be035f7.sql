-- Add price column to courses table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='price') THEN
    ALTER TABLE public.courses ADD COLUMN price numeric DEFAULT 0;
    ALTER TABLE public.courses ADD COLUMN is_free boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- Update existing courses to be free by default
UPDATE public.courses SET is_free = true WHERE price = 0 OR price IS NULL;