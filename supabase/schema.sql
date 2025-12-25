-- Create a table for public user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for QR Codes
create table qr_codes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  type text not null, -- 'url', 'wifi', 'vcard', etc.
  content text not null, -- The raw content (URL or JSON)
  meta jsonb default '{}'::jsonb, -- Store colors, customization
  scan_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table qr_codes enable row level security;

-- Policies for QR Codes
create policy "Users can view their own QRs." on qr_codes
  for select using (auth.uid() = user_id);

create policy "Public can view QRs (for redirect)." on qr_codes
  for select using (true);

create policy "Users can create QRs." on qr_codes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own QRs." on qr_codes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own QRs." on qr_codes
  for delete using (auth.uid() = user_id);

-- Analytics RPC (Bypass RLS)
create or replace function increment_scan_count(row_id uuid)
returns void as $$
begin
  update qr_codes
  set scan_count = scan_count + 1
  where id = row_id;
end;
$$ language plpgsql security definer;

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- =============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket called "uploads"
-- 3. Make it PUBLIC (toggle "Public bucket")
-- 4. Set the following policies:

-- Allow public to read any file (for viewing images)
-- Policy name: "Public can view files"
-- Allowed operation: SELECT
-- Policy definition: true

-- Allow authenticated users to upload (optional - for signed-in users only)
-- Policy name: "Anyone can upload"
-- Allowed operation: INSERT
-- Policy definition: true

-- Or run these SQL commands:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Create policy for public read access
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Create policy for public uploads (for demo purposes - in production, restrict to auth users)
-- CREATE POLICY "Allow Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
