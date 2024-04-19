DROP TABLE IF EXISTS stats CASCADE;
CREATE TABLE "stats" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "user_id" VARCHAR(255) NOT NULL,
  "card_id" Integer NOT NULL,
  "learning" Boolean,
  "star" Boolean,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);