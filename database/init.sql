-- Enable PostGIS extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Create schema for the application
CREATE SCHEMA IF NOT EXISTS geojobs;

-- Set default schema
SET search_path TO geojobs, public;

-- Create users table
CREATE TABLE IF NOT EXISTS geojobs.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for fast lookup
CREATE INDEX idx_users_email ON geojobs.users(email);

-- Create a simple health check table
CREATE TABLE IF NOT EXISTS geojobs.health_check (
    id INTEGER PRIMARY KEY DEFAULT 1,
    status VARCHAR(50) DEFAULT 'healthy',
    last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO geojobs.health_check (id, status) VALUES (1, 'healthy')
ON CONFLICT (id) DO NOTHING;
