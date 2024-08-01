-- Postgres

CREATE database sparta;

DROP TABLE IF EXISTS "Users";
DROP TABLE IF EXISTS "CodePass";

CREATE TABLE "Companies" (
    id serial PRIMARY KEY NOT NULL,
    cnpj_cia VARCHAR(20),
    denom_social VARCHAR(100),
    sit VARCHAR(40),
    dt_reg TIMESTAMP,
    dt_cancel TIMESTAMP
);


DROP table Companies;
DROP TABLE IF EXISTS companies;

SELECT * from Companies;


DROP TABLE "Users";
DROP TABLE "users";
DROP TABLE "Chat";
DROP TABLE "CodePass";
DROP TYPE "user_role";
DROP TYPE "user_plan";

SELECT * FROM "Users";
SELECT * FROM "CodePass";
SELECT * FROM "Chat";

DELETE FROM "CodePass" WHERE "userId" = 15;

DELETE FROM "Users" WHERE id = 18;

DELETE FROM "Users" WHERE id BETWEEN 11 AND 14;

ALTER TABLE "Users" ALTER COLUMN phone DROP NOT NULL;

CREATE TYPE "user_role" AS ENUM (
  'User',
  'Admin'
);

CREATE TYPE "user_plan" AS ENUM (
    'Yellow', 
    'HeartGold',
    'Emerald'
);

DROP TYPE user_plan CASCADE;



CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  location VARCHAR(255),
  role VARCHAR(50) DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
  plan VARCHAR(50) DEFAULT 'Basic' CHECK (plan IN ('Yellow', 'HeartGold', 'Emerald')),
  profilePicture VARCHAR(255) DEFAULT 'assets/ProfilePictureDefault/profile.png',
  googleId VARCHAR(255),
  authType VARCHAR(50) NOT NULL DEFAULT 'direct',
  stripeCustomerId VARCHAR(255),
  subscriptionStatus VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CodePass" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userId" int NOT NULL,
  "code" varchar NOT NULL,
  "expirationDate" timestamp NOT NULL,
  "createdAt" timestamp NOT NULL
);

CREATE TABLE "Chat" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userId" int NOT NULL,
  "name" varchar NOT NULL,
  "menssageHistory" text,
  "chatStart" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "chatEnd" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "newAnswer" text NOT NULL
);

drop table "Chat";
select * from "Chat";

CREATE TABLE "Suggestions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "createdBy" int NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NOT NULL,
  "upVotes" int NOT NULL,
  "status" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "Comments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "createdBy" int NOT NULL,
  "suggestionId" int NOT NULL,
  "content" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "Feedback" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "chatId" int NOT NULL,
  "userId" numnber NOT NULL,
  "feedback" bool NOT NULL,
  "rating" varchar NOT NULL,
  "feedbackTime" timestamp NOT NULL
);

CREATE TABLE "TrendAnalysis" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "chatId" int NOT NULL,
  "keyword" varchar NOT NULL,
  "frequency" int NOT NULL,
  "sentiment" varchar NOT NULL,
  "createdAt" timestamp NOT NULL
);

ALTER TABLE "CodePass" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("id");

ALTER TABLE "Suggestions" ADD FOREIGN KEY ("createdBy") REFERENCES "Users" ("id");

ALTER TABLE "Comments" ADD FOREIGN KEY ("createdBy") REFERENCES "Users" ("id");

ALTER TABLE "Comments" ADD FOREIGN KEY ("suggestionId") REFERENCES "Suggestions" ("id");

ALTER TABLE "Chat" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("id");

ALTER TABLE "Feedback" ADD FOREIGN KEY ("chatId") REFERENCES "Chat" ("id");

ALTER TABLE "Feedback" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("id");

ALTER TABLE "TrendAnalysis" ADD FOREIGN KEY ("chatId") REFERENCES "Chat" ("id");


