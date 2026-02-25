-- Incomes Table SQL Only
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their personal incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can create personal incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can update their incomes" ON public.incomes;
DROP POLICY IF EXISTS "Users can delete their incomes" ON public.incomes;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_incomes_updated_at ON public.incomes;

-- Drop existing table
DROP TABLE IF EXISTS public.incomes CASCADE;

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

-- Create indexes
CREATE INDEX idx_incomes_user_id ON public.incomes(user_id);
CREATE INDEX idx_incomes_organization_id ON public.incomes(organization_id);

-- Enable RLS
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;

-- Helper function for checking organization membership
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

-- Helper function for checking admin status
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

-- Incomes RLS policies
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_incomes_updated_at
  BEFORE UPDATE ON public.incomes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
