DROP TABLE IF EXISTS stats CASCADE;
CREATE TABLE "stats" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "card_id" Integer NOT NULL,
  "user_id" Integer NOT NULL,
  "learning" Integer DEFAULT 1,
  "memorized" Integer DEFAULT 0,
  "star" Boolean DEFAULT false,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);