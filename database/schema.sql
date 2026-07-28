-- =========================================================
-- Sylhet Smart Tourism Planner - Database Schema
-- Database: MySQL 8.x
-- =========================================================

CREATE DATABASE IF NOT EXISTS sylhet_tourism;
USE sylhet_tourism;

-- ---------------------------------------------------------
-- 1. USERS TABLE
-- One table stores every human who can log in: tourists,
-- guides, drivers and admins. The `role` column tells the
-- backend which "type" of account this is.
-- Guide/Driver-specific details live in their own tables
-- (guides, drivers) and link back here with user_id.
-- ---------------------------------------------------------
CREATE TABLE users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,       -- bcrypt hash, never plain text
    phone       VARCHAR(20),
    role        ENUM('tourist', 'guide', 'driver', 'admin') NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 2. GUIDES TABLE
-- Extra profile information only guides need.
-- Linked 1-to-1 with a row in `users` where role = 'guide'.
-- ---------------------------------------------------------
CREATE TABLE guides (
    guide_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL UNIQUE,
    experience    VARCHAR(100),
    languages     VARCHAR(150),
    description   TEXT,
    daily_charge  DECIMAL(10,2) NOT NULL,
    profile_image VARCHAR(255) DEFAULT 'default-avatar.png',
    status        ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- 3. DRIVERS TABLE
-- Extra profile information only drivers need.
-- ---------------------------------------------------------
CREATE TABLE drivers (
    driver_id       INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE,
    driving_license VARCHAR(50) NOT NULL,
    status          ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- 4. VEHICLES TABLE
-- Each vehicle belongs to exactly one driver.
-- ---------------------------------------------------------
CREATE TABLE vehicles (
    vehicle_id           INT AUTO_INCREMENT PRIMARY KEY,
    driver_id            INT NOT NULL,
    vehicle_name         VARCHAR(100) NOT NULL,
    vehicle_type         ENUM('Private Car', 'Microbus', 'Hiace', 'Tourist Bus') NOT NULL,
    passenger_capacity   INT NOT NULL,
    price_per_day        DECIMAL(10,2) NOT NULL,
    vehicle_image         VARCHAR(255),
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- 5. DESTINATIONS TABLE
-- Managed by Admin. Used on the Destinations page and by
-- the Smart Trip Planner logic.
-- ---------------------------------------------------------
CREATE TABLE destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    category       ENUM('Nature', 'Tea Gardens', 'Adventure', 'Religious Sites', 'Lakes', 'Photography') NOT NULL,
    description    TEXT,
    image          VARCHAR(255),
    entry_fee      DECIMAL(10,2) DEFAULT 0
);

-- ---------------------------------------------------------
-- 6. ITINERARIES TABLE
-- Stores a generated trip plan for a tourist so it can be
-- re-opened later from "My Trips".
-- ---------------------------------------------------------
CREATE TABLE itineraries (
    itinerary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    budget       DECIMAL(10,2) NOT NULL,
    num_days     INT NOT NULL,
    interests    VARCHAR(255) NOT NULL,   -- comma separated list
    plan_json    TEXT NOT NULL,           -- generated day-by-day plan
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- 7. GUIDE BOOKINGS TABLE
-- ---------------------------------------------------------
CREATE TABLE guide_bookings (
    booking_id  INT AUTO_INCREMENT PRIMARY KEY,
    tourist_id  INT NOT NULL,
    guide_id    INT NOT NULL,
    trip_date   DATE NOT NULL,
    days        INT NOT NULL,
    status      ENUM('Pending', 'Accepted', 'Rejected', 'Completed') DEFAULT 'Pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourist_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (guide_id) REFERENCES guides(guide_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- 8. VEHICLE BOOKINGS TABLE
-- ---------------------------------------------------------
CREATE TABLE vehicle_bookings (
    booking_id  INT AUTO_INCREMENT PRIMARY KEY,
    tourist_id  INT NOT NULL,
    vehicle_id  INT NOT NULL,
    trip_date   DATE NOT NULL,
    days        INT NOT NULL,
    status      ENUM('Pending', 'Accepted', 'Rejected', 'Completed') DEFAULT 'Pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourist_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- SEED DATA (optional starter data so the site isn't empty)
-- ---------------------------------------------------------
INSERT INTO destinations (name, category, description, image, entry_fee) VALUES
('Ratargul Swamp Forest', 'Nature', 'One of the few swamp forests in the world, best explored by boat.', 'ratargul.jpg', 100.00),
('Jaflong', 'Adventure', 'Hill-and-river border scenery with stone collection and the Piyain river.', 'jaflong.jpg', 0.00),
('Lalakhal', 'Lakes', 'Famous for its striking turquoise-blue water.', 'lalakhal.jpg', 0.00),
('Bichanakandi', 'Nature', 'A stone quarry area surrounded by hills and a clear-water stream.', 'bichanakandi.jpg', 0.00),
('Madhabkunda Waterfall', 'Adventure', 'The largest waterfall in Bangladesh, in a forest reserve.', 'madhabkunda.jpg', 20.00),
('Sylhet Tea Gardens', 'Tea Gardens', 'Rolling green tea estates spread across Sylhet''s hills.', 'tea-garden.jpg', 0.00);

-- Note: An admin account is created through the seed script (see
-- backend/config/seedAdmin.js) so the password is hashed properly
-- instead of stored as plain text here.
