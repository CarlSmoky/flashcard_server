DROP TABLE IF EXISTS stats CASCADE;
CREATE TABLE "stats" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "card_id" Integer NOT NULL,
  "user_id" Integer NOT NULL,
  "learning" Boolean DEFAULT true,
  "star" Boolean DEFAULT false,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);