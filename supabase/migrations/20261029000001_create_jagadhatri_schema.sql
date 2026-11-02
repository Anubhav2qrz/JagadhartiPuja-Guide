-- Jagadhatri Darshan Database Schema Migration
-- Nadia, West Bengal, India

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. LOCALITIES TABLE
CREATE TABLE IF NOT EXISTS public.localities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_localities_slug ON public.localities(slug);

-- 2. PANDALS TABLE
CREATE TABLE IF NOT EXISTS public.pandals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    description_bn TEXT,
    address TEXT NOT NULL,
    address_bn TEXT,
    locality_id UUID REFERENCES public.localities(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    cover_image_url TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('heritage', 'traditional', 'theme', 'prominent')),
    darshan_start TIMESTAMPTZ,
    darshan_end TIMESTAMPTZ,
    timings_verified_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    verified_at TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    accessibility JSONB DEFAULT '{"wheelchair_accessible": false}'::jsonb NOT NULL,
    committee_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pandals_slug ON public.pandals(slug);
CREATE INDEX IF NOT EXISTS idx_pandals_locality ON public.pandals(locality_id);
CREATE INDEX IF NOT EXISTS idx_pandals_published ON public.pandals(is_published);
CREATE INDEX IF NOT EXISTS idx_pandals_verified ON public.pandals(is_verified);
CREATE INDEX IF NOT EXISTS idx_pandals_coords ON public.pandals(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 3. PLACES (FOOD, RESTROOMS, PARKING, MEDICAL)
CREATE TABLE IF NOT EXISTS public.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('sweet_shop', 'food_stall', 'restaurant', 'parking', 'restroom', 'water', 'first_aid')),
    description TEXT NOT NULL,
    description_bn TEXT,
    address TEXT NOT NULL,
    address_bn TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    opening_hours JSONB,
    is_published BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);
CREATE INDEX IF NOT EXISTS idx_places_published ON public.places(is_published);

-- 4. ANNOUNCEMENTS TABLE (POLICE ADVISORIES, ROAD CLOSURES, TIMINGS)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    body TEXT NOT NULL,
    body_bn TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'alert')),
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT true NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(is_published);

-- 5. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'bn')),
    is_admin BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. SAVED PANDALS (FAVORITES)
CREATE TABLE IF NOT EXISTS public.saved_pandals (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pandal_id UUID REFERENCES public.pandals(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, pandal_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_pandals_user ON public.saved_pandals(user_id);

-- 7. SAVED ROUTES
CREATE TABLE IF NOT EXISTS public.saved_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    starting_latitude DOUBLE PRECISION,
    starting_longitude DOUBLE PRECISION,
    travel_mode TEXT NOT NULL DEFAULT 'walking' CHECK (travel_mode IN ('walking', 'driving')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saved_routes_user ON public.saved_routes(user_id);

-- 8. ROUTE STOPS
CREATE TABLE IF NOT EXISTS public.route_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES public.saved_routes(id) ON DELETE CASCADE NOT NULL,
    pandal_id UUID REFERENCES public.pandals(id) ON DELETE CASCADE NOT NULL,
    stop_order INTEGER NOT NULL,
    CONSTRAINT uq_route_stop_order UNIQUE (route_id, stop_order)
);

CREATE INDEX IF NOT EXISTS idx_route_stops_route ON public.route_stops(route_id, stop_order);

-- 9. COMMUNITY SUBMISSIONS & CORRECTIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_type TEXT NOT NULL CHECK (submission_type IN ('correction', 'new_pandal', 'timing_update')),
    pandal_id UUID REFERENCES public.pandals(id) ON DELETE SET NULL,
    submitted_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_pandals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Localities Policies
CREATE POLICY "Public visitors can read localities"
    ON public.localities FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage localities"
    ON public.localities FOR ALL
    USING (public.is_admin());

-- Pandals Policies
CREATE POLICY "Public visitors can read published pandals"
    ON public.pandals FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can insert and manage pandals"
    ON public.pandals FOR ALL
    USING (public.is_admin());

-- Places Policies
CREATE POLICY "Public visitors can read published places"
    ON public.places FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage places"
    ON public.places FOR ALL
    USING (public.is_admin());

-- Announcements Policies
CREATE POLICY "Public visitors can read published announcements"
    ON public.announcements FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage announcements"
    ON public.announcements FOR ALL
    USING (public.is_admin());

-- Profiles Policies
CREATE POLICY "Users can read and update their own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- Saved Pandals Policies
CREATE POLICY "Users can manage their own saved pandals"
    ON public.saved_pandals FOR ALL
    USING (auth.uid() = user_id);

-- Saved Routes & Stops Policies
CREATE POLICY "Users can manage their own saved routes"
    ON public.saved_routes FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage route stops for their routes"
    ON public.route_stops FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.saved_routes
            WHERE id = public.route_stops.route_id
            AND user_id = auth.uid()
        )
    );

-- Submissions Policies
CREATE POLICY "Anyone can insert community submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (status = 'pending');

CREATE POLICY "Admins can view and manage submissions"
    ON public.submissions FOR ALL
    USING (public.is_admin());

