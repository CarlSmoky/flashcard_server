DROP TABLE IF EXISTS cards CASCADE;
CREATE TABLE "cards" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "deck_id" Integer NOT NULL,
  "term" VARCHAR(255) UNIQUE NOT NULL,
  "definition" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);