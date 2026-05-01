/*
  # Create MediCare Hospital Management System Tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `gender` (text)
      - `blood_type` (text)
      - `date_of_birth` (date)
      - `address` (text)
      - `role` (text, default 'patient')
      - `created_at` (timestamptz, default now())
    - `doctors`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `full_name` (text, not null)
      - `specialization` (text, not null)
      - `qualification` (text)
      - `experience_years` (integer, default 0)
      - `bio` (text)
      - `phone` (text)
      - `email` (text)
      - `consultation_fee` (numeric, default 100)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `appointments`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `patient_id` (uuid, references profiles)
      - `doctor_id` (uuid, references doctors)
      - `guest_name` (text)
      - `guest_email` (text)
      - `guest_phone` (text)
      - `appointment_date` (date)
      - `appointment_time` (text)
      - `status` (text, default 'pending')
      - `notes` (text)
      - `type` (text, default 'consultation')
      - `created_at` (timestamptz, default now())
    - `medical_records`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `patient_id` (uuid, references profiles)
      - `doctor_id` (uuid, references doctors)
      - `diagnosis` (text)
      - `prescription` (text)
      - `notes` (text)
      - `visit_date` (date)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read/update own data, admins can read all
    - Doctors: anyone can read active doctors, admins can manage all
    - Appointments: patients can manage own, admins can manage all, guests can insert
    - Medical records: patients can read own, admins can manage all
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  gender text DEFAULT '',
  blood_type text DEFAULT '',
  date_of_birth date,
  address text DEFAULT '',
  role text DEFAULT 'patient',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  specialization text NOT NULL,
  qualification text DEFAULT '',
  experience_years integer DEFAULT 0,
  bio text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  consultation_fee numeric DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert doctors"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update doctors"
  ON doctors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete doctors"
  ON doctors FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id),
  doctor_id uuid REFERENCES doctors(id),
  guest_name text DEFAULT '',
  guest_email text DEFAULT '',
  guest_phone text DEFAULT '',
  appointment_date date,
  appointment_time text DEFAULT '',
  status text DEFAULT 'pending',
  notes text DEFAULT '',
  type text DEFAULT 'consultation',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Admins can read all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can insert appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid() OR patient_id IS NULL);

CREATE POLICY "Admins can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id),
  doctor_id uuid REFERENCES doctors(id),
  diagnosis text DEFAULT '',
  prescription text DEFAULT '',
  notes text DEFAULT '',
  visit_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Admins can read all medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert medical records"
  ON medical_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update medical records"
  ON medical_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete medical records"
  ON medical_records FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
