DROP TABLE IF EXISTS learning_status CASCADE;
CREATE TABLE "learning_status" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "status" VARCHAR(255),
  "description" VARCHAR(255)
);