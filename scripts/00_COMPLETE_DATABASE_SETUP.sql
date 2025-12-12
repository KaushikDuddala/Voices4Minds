-- ============================================================================
-- MENTAL HEALTH PLATFORM - COMPLETE DATABASE SETUP SCRIPT
-- ============================================================================
-- This script creates all tables, policies, functions, and seed data needed
-- for the mental health platform. Run this script on a fresh Supabase instance
-- to set up the entire database.
--
-- EXECUTION ORDER: Run this script once on initial setup
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable Required Extensions
-- ============================================================================
-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 2: Create Core Tables
-- ============================================================================

-- Profiles table (extends auth.users with additional user information)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('user', 'counselor', 'admin')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Counselor profiles table (additional information for counselors)
CREATE TABLE IF NOT EXISTS public.counselor_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  specializations TEXT[],
  credentials TEXT,
  phone TEXT,
  location TEXT,
  years_experience INTEGER,
  is_accepting_patients BOOLEAN DEFAULT true,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Counselor weekly availability (recurring schedule)
CREATE TABLE IF NOT EXISTS public.counselor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  counselor_id UUID REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(counselor_id, day_of_week, start_time, end_time)
);

-- Counselor date overrides (specific date blocks or special availability)
CREATE TABLE IF NOT EXISTS public.counselor_date_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  counselor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  override_date DATE NOT NULL,
  is_available BOOLEAN DEFAULT false, -- false = blocked, true = special availability
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(counselor_id, override_date)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  counselor_id UUID REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum categories
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum replies
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_date_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Create RLS Policies
-- ============================================================================
-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Counselor profiles policies (public read, counselor write)
CREATE POLICY "counselor_profiles_select_all" ON public.counselor_profiles FOR SELECT USING (true);
CREATE POLICY "counselor_profiles_insert_own" ON public.counselor_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "counselor_profiles_update_own" ON public.counselor_profiles FOR UPDATE USING (auth.uid() = id);

-- Counselor availability policies
CREATE POLICY "counselor_availability_select_all" ON public.counselor_availability FOR SELECT USING (true);
CREATE POLICY "counselor_availability_insert_own" ON public.counselor_availability FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.counselor_profiles WHERE id = counselor_id AND id = auth.uid())
);
CREATE POLICY "counselor_availability_update_own" ON public.counselor_availability FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.counselor_profiles WHERE id = counselor_id AND id = auth.uid())
);
CREATE POLICY "counselor_availability_delete_own" ON public.counselor_availability FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.counselor_profiles WHERE id = counselor_id AND id = auth.uid())
);

-- Counselor date overrides policies
CREATE POLICY "counselor_date_overrides_select_all" ON public.counselor_date_overrides FOR SELECT USING (true);
CREATE POLICY "counselor_date_overrides_insert_own" ON public.counselor_date_overrides FOR INSERT WITH CHECK (auth.uid() = counselor_id);
CREATE POLICY "counselor_date_overrides_update_own" ON public.counselor_date_overrides FOR UPDATE USING (auth.uid() = counselor_id);
CREATE POLICY "counselor_date_overrides_delete_own" ON public.counselor_date_overrides FOR DELETE USING (auth.uid() = counselor_id);

-- Appointments policies
CREATE POLICY "appointments_select_own" ON public.appointments FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = counselor_id
);
CREATE POLICY "appointments_insert_users" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "appointments_update_own" ON public.appointments FOR UPDATE USING (
  auth.uid() = user_id OR auth.uid() = counselor_id
);
CREATE POLICY "appointments_delete_own" ON public.appointments FOR DELETE USING (
  auth.uid() = user_id OR auth.uid() = counselor_id
);

-- Forum categories policies (public read)
CREATE POLICY "forum_categories_select_all" ON public.forum_categories FOR SELECT USING (true);

-- Forum posts policies
CREATE POLICY "forum_posts_select_all" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "forum_posts_insert_authenticated" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "forum_posts_update_own" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "forum_posts_delete_own" ON public.forum_posts FOR DELETE USING (auth.uid() = author_id);

-- Forum replies policies
CREATE POLICY "forum_replies_select_all" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "forum_replies_insert_authenticated" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "forum_replies_update_own" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "forum_replies_delete_own" ON public.forum_replies FOR DELETE USING (auth.uid() = author_id);

-- Blog posts policies
CREATE POLICY "blog_posts_select_published" ON public.blog_posts FOR SELECT USING (
  is_published = true OR auth.uid() = author_id
);
CREATE POLICY "blog_posts_insert_authenticated" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "blog_posts_update_own" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "blog_posts_delete_own" ON public.blog_posts FOR DELETE USING (auth.uid() = author_id);

-- Testimonials policies
CREATE POLICY "testimonials_select_approved" ON public.testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "testimonials_insert_all" ON public.testimonials FOR INSERT WITH CHECK (true);

-- ============================================================================
-- STEP 5: Create Database Functions & Triggers
-- ============================================================================
-- Function to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to execute handle_new_user function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_counselor_profiles_updated_at 
  BEFORE UPDATE ON public.counselor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at 
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at 
  BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 6: Create Performance Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_counselor_id ON public.appointments(counselor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON public.forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON public.forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_counselor_profiles_approval_status ON public.counselor_profiles(approval_status);

-- ============================================================================
-- STEP 7: Seed Initial Data
-- ============================================================================
-- Insert forum categories
INSERT INTO public.forum_categories (name, description, slug) VALUES
  ('Anxiety Support', 'Share experiences and coping strategies for anxiety', 'anxiety-support'),
  ('Depression & Mood', 'Discuss depression, mood disorders, and recovery', 'depression-mood'),
  ('Stress Management', 'Tips and techniques for managing daily stress', 'stress-management'),
  ('Self-Care', 'Share self-care practices and wellness routines', 'self-care'),
  ('Success Stories', 'Inspiring stories of overcoming mental health challenges', 'success-stories'),
  ('General Discussion', 'Open discussion about mental health topics', 'general-discussion')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.testimonials (author_name, content, is_approved, is_featured) VALUES
  ('Sarah M.', 'Finding support through this platform changed my life. The counselors are compassionate and truly understand what it''s like to struggle with anxiety. I''m grateful for the resources and community here.', true, true),
  ('Michael T.', 'After years of dealing with depression alone, I finally reached out. The appointment scheduling made it so easy to connect with a counselor. I''m now on a path to recovery and feeling hopeful.', true, true),
  ('Emily R.', 'The community forums provided a safe space where I could share my struggles without judgment. Knowing I''m not alone has been incredibly powerful in my healing journey.', true, true),
  ('James K.', 'I was hesitant about online counseling, but the professionals here are exceptional. The flexible scheduling and comfortable environment made all the difference in my mental health journey.', true, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF SETUP SCRIPT
-- ============================================================================
