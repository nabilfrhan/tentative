-- Create tentatives table
CREATE TABLE IF NOT EXISTS tentatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date_range TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create days table
CREATE TABLE IF NOT EXISTS days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tentative_id UUID NOT NULL REFERENCES tentatives(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create itinerary_items table
CREATE TABLE IF NOT EXISTS itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  time TEXT DEFAULT '',
  location TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_days_tentative_id ON days(tentative_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day_id ON itinerary_items(day_id);
