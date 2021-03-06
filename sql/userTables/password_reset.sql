DROP TABLE IF EXISTS password_reset_codes CASCADE;
CREATE TABLE password_reset_codes(
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL REFERENCES users(email),
  code VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);