/*
  # Quiz and Challenge System Schema

  1. New Tables
    - `quizzes`
      - `id` (uuid, primary key)
      - `topic` (text) - e.g., 'arrays', 'linked_lists'
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)
      
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, foreign key)
      - `question` (text)
      - `options` (jsonb) - array of options
      - `correct_answer` (integer)
      - `explanation` (text)
      - `order` (integer)
      
    - `challenges`
      - `id` (uuid, primary key)
      - `topic` (text)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text)
      - `starter_code` (text)
      - `language` (text)
      - `created_at` (timestamp)
      
    - `challenge_test_cases`
      - `id` (uuid, primary key)
      - `challenge_id` (uuid, foreign key)
      - `input` (text)
      - `expected_output` (text)
      - `order` (integer)
      
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `quiz_id` (uuid, foreign key)
      - `challenge_id` (uuid, foreign key)
      - `score` (integer)
      - `completed_at` (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  starter_code text NOT NULL,
  language text NOT NULL CHECK (language IN ('javascript', 'python', 'cpp', 'java')),
  created_at timestamptz DEFAULT now()
);

-- Create challenge test cases table
CREATE TABLE IF NOT EXISTS challenge_test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  input text NOT NULL,
  expected_output text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  score integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  CHECK (quiz_id IS NOT NULL OR challenge_id IS NOT NULL)
);

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for quizzes
CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes
  FOR SELECT
  TO public
  USING (true);

-- Create policies for quiz questions
CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions
  FOR SELECT
  TO public
  USING (true);

-- Create policies for challenges
CREATE POLICY "Challenges are viewable by everyone"
  ON challenges
  FOR SELECT
  TO public
  USING (true);

-- Create policies for challenge test cases
CREATE POLICY "Challenge test cases are viewable by everyone"
  ON challenge_test_cases
  FOR SELECT
  TO public
  USING (true);

-- Create policies for user progress
CREATE POLICY "Users can view their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);