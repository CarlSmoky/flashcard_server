DROP TABLE IF EXISTS decks CASCADE;
CREATE TABLE "decks" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "deck_name" VARCHAR(255) UNIQUE NOT NULL,
  "user_id" Integer,
  "description" VARCHAR(512),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);