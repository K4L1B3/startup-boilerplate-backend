-- SQLite

CREATE database sparta;

DROP TABLE IF EXISTS Companies;

CREATE TABLE companies (
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
  'Plan1',
  'Plan2',
  'Trial'
);

CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "phone" varchar(15) NULL,
  "password" varchar,
  "location" varchar,
  "profilePicture" varchar DEFAULT 'assets/ProfilePictureDefault/profile.png',
  "googleId" varchar,
  "authType" varchar NOT NULL DEFAULT 'direct',
  "role" user_role NOT NULL DEFAULT 'User',
  "plan" user_plan NOT NULL DEFAULT 'Plan1'
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


