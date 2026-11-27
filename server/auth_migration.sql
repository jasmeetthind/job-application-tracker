-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add an owner to each job application
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS user_id UUID
REFERENCES users(id) ON DELETE CASCADE;

-- Improve searches for a user's applications
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id
ON job_applications(user_id);
