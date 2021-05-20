-- -------------------------------------------------------------
-- TablePlus 3.12.8(368)
--
-- https://tableplus.com/
--
-- Database: defaultdb
-- Generation Time: 2021-05-21 02:30:42.8890
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."login";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."login" (
    "email" varchar(100),
    "hash" bpchar(60)
);

DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "entries" int4 DEFAULT 0,
    "email" varchar(100),
    "name" varchar(100),
    "joined" date,
    PRIMARY KEY ("id")
);

