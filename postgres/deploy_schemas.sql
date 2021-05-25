-- Deploy fresh database tables --

\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'

-- \i '/docker-entrypoint-initdb.d/seed/seed.sql'
INSERT INTO "public"."users" ("id", "name", "email", "entries", "joined") VALUES
(1, 'A-Don', 'a@g.co', 0, '2021-05-24 19:34:36.389');

INSERT INTO "public"."login" ("id", "hash", "email") VALUES
(1, '$2a$10$2fvaFH8Gg2DL5gg80kPEeOGArh.pOhuSWn1zMu29w4b2zE/q9vpEa', 'a@g.co');