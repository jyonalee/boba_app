/*
  # Schema Refactoring for Boba Discovery App

  1. Drop Tables
    - `shops` - Will be replaced with Google Maps API data
    - `comments` - No longer needed

  2. New Tables
    - `preferences` - Store user preferences for boba
      - `user_id` (uuid, primary key, references profiles.id)
      - `sweetness_level` (text)
      - `toppings` (text[])
      - `tea_bases` (text[])
      - `lactose_free` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  3. Security
    - Enable RLS on the new table
    - Add policies for authenticated users
*/

-- Drop existing tables
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS shops;

-- Create preferences table
CREATE TABLE preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  sweetness_level text NOT NULL DEFAULT 'Regular',
  toppings text[] NOT NULL DEFAULT ARRAY['Boba'],
  tea_bases text[] NOT NULL DEFAULT ARRAY['Black Tea'],
  lactose_free boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preferences"
  ON preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_preferences_updated_at
BEFORE UPDATE ON preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 