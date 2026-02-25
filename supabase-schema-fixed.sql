-- Finance Tracker Database Schema (FIXED - No RLS Recursion)
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies first (they depend on functions)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view organizations they are members of" ON public.organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners and admins can update" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can delete" ON public.organizations;
DROP POLICY IF EXISTS "Users can view members of their organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Organization creators and admins can add members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can add members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can update members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can remove members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view their personal subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can create personal subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can delete their subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their personal incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can create personal incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can update their incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can delete their incomes" ON public.incomes;

-- Drop existing triggers (to avoid dependency errors)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP TRIGGER IF EXISTS update_incomes_updated_at ON public.incomes;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_current_user_id();
DROP FUNCTION IF EXISTS public.user_profile_exists();
DROP FUNCTION IF EXISTS public.is_org_admin(UUID);
DROP FUNCTION IF EXISTS public.is_org_member(UUID);
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.incomes CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  kvk_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

-- Create organization_members table (join table for users and organizations)
CREATE TABLE public.organization_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  publisher TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'quarterly', 'semi-annual', 'annual', 'one-time')) NOT NULL,
  category TEXT NOT NULL,
  context TEXT CHECK (context IN ('personal', 'organisation')) NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  next_billing_date DATE NOT NULL,
  start_date DATE NOT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create incomes table
CREATE TABLE public.incomes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'semi-annual', 'annual', 'one-time')) NOT NULL,
  category TEXT NOT NULL,
  context TEXT CHECK (context IN ('personal', 'organisation')) NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  next_receipt_date DATE NOT NULL,
  start_date DATE NOT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_organization_id ON public.subscriptions(organization_id);
CREATE INDEX idx_incomes_user_id ON public.incomes(user_id);
CREATE INDEX idx_incomes_organization_id ON public.incomes(organization_id);
CREATE INDEX idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_organization_members_org_id ON public.organization_members(organization_id);

-- Helper function to check if user can create organizations
CREATE OR REPLACE FUNCTION public.can_create_organization(org_created_by UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = org_created_by;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user's profile exists
CREATE OR REPLACE FUNCTION public.user_profile_exists()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Debug function to check auth.uid() (REMOVE IN PRODUCTION)
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Users can view organizations they are members of"
  ON public.organizations FOR SELECT
  USING (is_org_member(id));

CREATE POLICY "Users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Organization owners and admins can update"
  ON public.organizations FOR UPDATE
  USING (is_org_admin(id));

CREATE POLICY "Organization owners can delete"
  ON public.organizations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role = 'owner'
    )
  );

-- Organization members policies (FIXED - using functions and avoiding recursion)
CREATE POLICY "Users can view members of their organizations"
  ON public.organization_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_org_member(organization_id)
  );

CREATE POLICY "Organization creators and admins can add members"
  ON public.organization_members FOR INSERT
  WITH CHECK (
    -- Allow if user is the organization creator
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE organizations.id = organization_members.organization_id
      AND organizations.created_by = auth.uid()
    )
    OR
    -- Or if user is already an admin/owner (checked via function)
    is_org_admin(organization_members.organization_id)
  );

CREATE POLICY "Organization owners and admins can update members"
  ON public.organization_members FOR UPDATE
  USING (is_org_admin(organization_id));

CREATE POLICY "Organization owners and admins can remove members"
  ON public.organization_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    is_org_admin(organization_id)
  );

-- Subscriptions policies
CREATE POLICY "Users can view their personal subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_member(organization_id))
  );

CREATE POLICY "Users can create personal subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_member(organization_id))
  );

CREATE POLICY "Users can update their subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_member(organization_id))
  );

CREATE POLICY "Users can delete their subscriptions"
  ON public.subscriptions FOR DELETE
  USING (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_admin(organization_id))
  );

-- Incomes policies
CREATE POLICY "Users can view their personal incomes"
  ON public.incomes FOR SELECT
  USING (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_member(organization_id))
  );

CREATE POLICY "Users can create personal incomes"
  ON public.incomes FOR INSERT
  WITH CHECK (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_member(organization_id))
  );

CREATE POLICY "Users can update their incomes"
  ON public.incomes FOR UPDATE
  USING (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_member(organization_id))
  );

CREATE POLICY "Users can delete their incomes"
  ON public.incomes FOR DELETE
  USING (
    (context = 'personal' AND user_id = auth.uid()) OR
    (context = 'organisation' AND is_org_admin(organization_id))
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_incomes_updated_at
  BEFORE UPDATE ON public.incomes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
