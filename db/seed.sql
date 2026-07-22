-- =============================================================================
-- Global Mobilis — Seed Data
-- 15+ Popular Migration Destinations
-- =============================================================================

-- =============================================================================
-- DESTINATIONS
-- =============================================================================
INSERT INTO destinations (country, city, region, continent, flag_emoji, job_score, education_score, business_score, tourism_score, quality_of_life_score, safety_score, avg_rent_1br, avg_rent_3br, cost_of_living_index, avg_monthly_utilities, avg_monthly_groceries, avg_monthly_transport, description, short_description, languages, currency, timezone, is_featured) VALUES

-- 1. Canada – Toronto
('Canada', 'Toronto', 'Ontario', 'North America', '🇨🇦',
 92, 88, 90, 85, 87, 82,
 1800, 3200, 78.5, 150, 400, 130,
 'Toronto is Canada''s largest city and a global hub for finance, technology, and culture. With a thriving job market, world-class universities, and one of the most multicultural populations on Earth, it''s consistently ranked as one of the best cities for immigrants.',
 'Canada''s largest city — a global hub for finance, tech, and culture with unmatched diversity.',
 ARRAY['English', 'French'], 'CAD', 'America/Toronto', TRUE),

-- 2. Canada – Vancouver
('Canada', 'Vancouver', 'British Columbia', 'North America', '🇨🇦',
 78, 80, 75, 92, 85, 85,
 2200, 3800, 85.2, 160, 420, 120,
 'Nestled between mountains and ocean, Vancouver offers an unparalleled quality of life. Its booming tech scene, film industry, and mild climate make it a top choice for professionals and families alike.',
 'A stunning coastal city where mountains meet ocean — a paradise for nature lovers.',
 ARRAY['English', 'French', 'Chinese', 'Punjabi'], 'CAD', 'America/Vancouver', TRUE),

-- 3. United Kingdom – London
('United Kingdom', 'London', 'England', 'Europe', '🇬🇧',
 95, 92, 93, 90, 80, 70,
 2100, 3800, 82.3, 180, 380, 150,
 'London is one of the world''s most influential cities — a global financial center with unparalleled cultural institutions, top universities, and a truly international workforce. The job market is diverse and competitive.',
 'One of the world''s great global cities — finance, culture, and endless opportunity.',
 ARRAY['English'], 'GBP', 'Europe/London', TRUE),

-- 4. Germany – Berlin
('Germany', 'Berlin', 'Berlin', 'Europe', '🇩🇪',
 85, 82, 88, 88, 83, 80,
 1200, 2200, 65.3, 200, 350, 90,
 'Berlin is Europe''s startup capital and a magnet for creatives, tech professionals, and entrepreneurs. Its affordable cost of living (for a major European capital), vibrant arts scene, and excellent public services make it a top relocation destination.',
 'Europe''s startup capital — affordable, creative, and buzzing with opportunity.',
 ARRAY['German', 'English'], 'EUR', 'Europe/Berlin', TRUE),

-- 5. Germany – Munich
('Germany', 'Munich', 'Bavaria', 'Europe', '🇩🇪',
 88, 85, 82, 85, 90, 85,
 1500, 2800, 72.1, 220, 380, 85,
 'Munich combines Germany''s economic powerhouse status with Bavarian charm. Home to BMW, Siemens, and a thriving tech scene, it offers excellent job prospects, top-tier education, and a high quality of life.',
 'Where Bavarian tradition meets German engineering — a hub for tech and industry.',
 ARRAY['German', 'English'], 'EUR', 'Europe/Berlin', FALSE),

-- 6. Australia – Sydney
('Australia', 'Sydney', 'New South Wales', 'Oceania', '🇦🇺',
 88, 85, 82, 95, 90, 80,
 2000, 3800, 80.1, 180, 450, 140,
 'Sydney is Australia''s iconic harbor city — a global financial center with beautiful beaches, a warm climate, and a laid-back lifestyle. The economy is strong across finance, tech, healthcare, and education.',
 'Australia''s iconic harbor city — sun, surf, and a world-class economy.',
 ARRAY['English'], 'AUD', 'Australia/Sydney', TRUE),

-- 7. Australia – Melbourne
('Australia', 'Melbourne', 'Victoria', 'Oceania', '🇦🇺',
 85, 90, 80, 88, 88, 82,
 1600, 3000, 75.3, 170, 420, 130,
 'Melbourne is Australia''s cultural capital — famous for its coffee, arts, and food scene. It consistently ranks among the world''s most livable cities, with excellent universities and a growing tech ecosystem.',
 'Australia''s cultural capital — world-class coffee, arts, and livability.',
 ARRAY['English'], 'AUD', 'Australia/Melbourne', TRUE),

-- 8. United Arab Emirates – Dubai
('United Arab Emirates', 'Dubai', 'Dubai', 'Asia', '🇦🇪',
 90, 75, 95, 92, 80, 88,
 1600, 3200, 75.8, 200, 400, 80,
 'Dubai has transformed into a global business and tourism hub. With zero income tax, world-class infrastructure, and a booming economy, it attracts professionals from around the world. The lifestyle is luxurious and cosmopolitan.',
 'A global business hub with zero income tax and unmatched ambition.',
 ARRAY['Arabic', 'English', 'Hindi', 'Urdu'], 'AED', 'Asia/Dubai', TRUE),

-- 9. Singapore
('Singapore', 'Singapore', 'Central', 'Asia', '🇸🇬',
 92, 90, 95, 85, 88, 95,
 2500, 4500, 88.5, 150, 500, 100,
 'Singapore is a city-state that punches far above its weight. A global financial hub with world-class education, exceptional safety, and a strategic location in Asia. The cost of living is high, but so are salaries and quality of life.',
 'Asia''s most dynamic city-state — finance, safety, and world-class education.',
 ARRAY['English', 'Mandarin', 'Malay', 'Tamil'], 'SGD', 'Asia/Singapore', TRUE),

-- 10. Netherlands – Amsterdam
('Netherlands', 'Amsterdam', 'North Holland', 'Europe', '🇳🇱',
 82, 78, 85, 90, 85, 82,
 1700, 3000, 75.0, 180, 380, 100,
 'Amsterdam is a compact, bike-friendly city with a strong economy, excellent English proficiency, and a progressive culture. It''s a hub for tech, finance, and creative industries, with a high quality of life.',
 'Bike-friendly, progressive, and a hub for tech and innovation in Europe.',
 ARRAY['Dutch', 'English'], 'EUR', 'Europe/Amsterdam', TRUE),

-- 11. New Zealand – Auckland
('New Zealand', 'Auckland', 'Auckland', 'Oceania', '🇳🇿',
 75, 78, 72, 90, 90, 85,
 1600, 2800, 72.5, 150, 400, 120,
 'Auckland is New Zealand''s largest city, offering a relaxed lifestyle surrounded by stunning natural beauty. With a growing tech sector, excellent work-life balance, and welcoming immigration policies, it''s a top choice for those seeking a fresh start.',
 'New Zealand''s largest city — stunning landscapes meet a relaxed lifestyle.',
 ARRAY['English', 'Maori'], 'NZD', 'Pacific/Auckland', FALSE),

-- 12. Ireland – Dublin
('Ireland', 'Dublin', 'Leinster', 'Europe', '🇮🇪',
 85, 80, 82, 78, 80, 78,
 1800, 3200, 78.0, 200, 380, 120,
 'Dublin is a tech and pharma powerhouse — home to the European headquarters of Google, Apple, Meta, and Pfizer. With a young, English-speaking population and a strong economy, it''s a prime destination for professionals.',
 'Europe''s tech capital — home to global tech giants and a young workforce.',
 ARRAY['English', 'Irish'], 'EUR', 'Europe/Dublin', TRUE),

-- 13. United States – New York
('United States', 'New York', 'New York', 'North America', '🇺🇸',
 95, 90, 95, 95, 75, 65,
 3500, 6000, 100.0, 200, 550, 130,
 'New York City is the ultimate global city — the world''s financial capital, a cultural mecca, and a melting pot of diversity. Career opportunities are unparalleled across finance, tech, media, fashion, and the arts.',
 'The ultimate global city — finance, culture, and career opportunity at its peak.',
 ARRAY['English', 'Spanish', 'Chinese'], 'USD', 'America/New_York', TRUE),

-- 14. United States – San Francisco
('United States', 'San Francisco', 'California', 'North America', '🇺🇸',
 92, 85, 95, 85, 70, 60,
 3500, 6500, 98.5, 180, 500, 120,
 'San Francisco is the heart of global technology and innovation. As the gateway to Silicon Valley, it offers unmatched career opportunities in tech, though the cost of living is among the highest in the world.',
 'The heart of global innovation — Silicon Valley''s gateway city.',
 ARRAY['English', 'Spanish', 'Chinese'], 'USD', 'America/Los_Angeles', TRUE),

-- 15. Portugal – Lisbon
('Portugal', 'Lisbon', 'Lisbon', 'Europe', '🇵🇹',
 72, 70, 75, 92, 82, 85,
 1000, 1800, 55.0, 120, 300, 50,
 'Lisbon has become one of Europe''s most popular relocation destinations. With its sunny climate, affordable cost of living, friendly visa programs (D7, Golden Visa), and growing startup scene, it''s a top choice for digital nomads and retirees.',
 'Europe''s sunny gem — affordable, welcoming, and a digital nomad hotspot.',
 ARRAY['Portuguese', 'English'], 'EUR', 'Europe/Lisbon', TRUE),

-- 16. Japan – Tokyo
('Japan', 'Tokyo', 'Tokyo', 'Asia', '🇯🇵',
 85, 88, 82, 92, 80, 90,
 1400, 2800, 72.0, 180, 400, 80,
 'Tokyo is a city of endless discovery — a fascinating blend of ultramodern and traditional. With a strong economy, excellent public transport, and world-class cuisine, it offers a unique and rewarding experience for expats.',
 'A fascinating blend of tradition and cutting-edge innovation.',
 ARRAY['Japanese', 'English'], 'JPY', 'Asia/Tokyo', FALSE),

-- 17. Spain – Barcelona
('Spain', 'Barcelona', 'Catalonia', 'Europe', '🇪🇸',
 70, 72, 75, 95, 80, 75,
 1000, 2000, 58.0, 130, 320, 55,
 'Barcelona offers a Mediterranean lifestyle with a vibrant tech scene, stunning architecture, and world-class beaches. It''s increasingly popular with remote workers and entrepreneurs drawn to its quality of life.',
 'Mediterranean lifestyle meets a vibrant tech and startup scene.',
 ARRAY['Spanish', 'Catalan', 'English'], 'EUR', 'Europe/Madrid', TRUE),

-- 18. Sweden – Stockholm
('Sweden', 'Stockholm', 'Stockholm', 'Europe', '🇸🇪',
 80, 82, 78, 80, 90, 85,
 1400, 2500, 70.0, 150, 380, 90,
 'Stockholm is a beautiful archipelago city with a strong economy, excellent social services, and a high quality of life. It''s a hub for tech innovation (Spotify, Klarna) and consistently ranks among the most sustainable cities.',
 'Scandinavian innovation hub — beautiful, sustainable, and family-friendly.',
 ARRAY['Swedish', 'English'], 'SEK', 'Europe/Stockholm', FALSE);

-- =============================================================================
-- SAMPLE COMMUNITIES
-- =============================================================================
-- Note: These reference user IDs that won't exist until users register.
-- They are included as reference for when the app goes live.

-- INSERT INTO communities (name, slug, description, type, destination_id, created_by)
-- VALUES
--   ('Toronto Tech Expats', 'toronto-tech-expats', 'A group for tech professionals relocating to Toronto.', 'professional', (SELECT id FROM destinations WHERE city = 'Toronto' LIMIT 1), '<user_id>'),
--   ('Berlin Creatives', 'berlin-creatives', 'Artists, designers, and creatives building a life in Berlin.', 'cultural', (SELECT id FROM destinations WHERE city = 'Berlin' LIMIT 1), '<user_id>'),
--   ('Dubai Entrepreneurs', 'dubai-entrepreneurs', 'Business owners and startup founders in Dubai.', 'professional', (SELECT id FROM destinations WHERE city = 'Dubai' LIMIT 1), '<user_id>'),
--   ('Global Nomads', 'global-nomads', 'For those who call the whole world home.', 'social', NULL, '<user_id>'),
--   ('London Finance & Tech', 'london-finance-tech', 'Network for finance and tech professionals in London.', 'professional', (SELECT id FROM destinations WHERE city = 'London' LIMIT 1), '<user_id>'),
--   ('New Families in Sydney', 'new-families-sydney', 'Support for families relocating to Sydney with children.', 'support', (SELECT id FROM destinations WHERE city = 'Sydney' LIMIT 1), '<user_id>');

-- =============================================================================
-- SAMPLE DESTINATION REVIEWS (commented out — requires user IDs)
-- These are provided as seed data reference for the mock data in lib/reviews.ts
-- =============================================================================
-- INSERT INTO destination_reviews (destination_id, user_id, rating, review_text, pros, cons, image_url) VALUES
--   ((SELECT id FROM destinations WHERE city = 'Toronto' LIMIT 1), '<user_id>', 5, 'Absolutely love Toronto! The multicultural vibe is unmatched. Great job opportunities in tech.', ARRAY['Diverse culture', 'Great food scene', 'Strong job market'], ARRAY['Expensive rent', 'Cold winters'], ''),
--   ((SELECT id FROM destinations WHERE city = 'London' LIMIT 1), '<user_id>', 5, 'London is incredible! So much history, culture, and career opportunities.', ARRAY['World-class museums', 'Career growth', 'Public transport'], ARRAY['Very expensive', 'Crowded'], ''),
--   ((SELECT id FROM destinations WHERE city = 'Berlin' LIMIT 1), '<user_id>', 5, 'Berlin is the best decision I ever made. Creative, affordable, and incredibly welcoming.', ARRAY['Affordable', 'Creative scene', 'English-friendly'], ARRAY['Bureaucracy', 'Weather'], ''),
--   ((SELECT id FROM destinations WHERE city = 'Vancouver' LIMIT 1), '<user_id>', 4, 'Stunning natural beauty but very expensive. The outdoor lifestyle is unbeatable though.', ARRAY['Nature', 'Hiking trails', 'Mild winters'], ARRAY['Very expensive', 'Rainy season'], '');