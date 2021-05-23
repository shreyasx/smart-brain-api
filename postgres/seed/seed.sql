BEGIN TRANSACTION;

INSERT INTO "public"."users" ("id", "email", "name", "joined") VALUES
(1, 'shreyxs@gmail.com', 'Shreyyyy', '2021-05-21');

INSERT INTO "public"."users" ("id", "email", "name", "joined") VALUES
(2, 's@g.co', 'Try', '2020-05-21');

INSERT INTO "public"."users" ("id", "email", "name", "joined") VALUES
(3, 'shrxs@gml.com', 'Shrey', '2018-05-21');

INSERT INTO "public"."login" ("email", "hash") VALUES
('shreyxs@gmail.com', '$2a$10$dJJEvyZ0wMH3Lta9bWyPde1/1vfVNaC7uiXChls/bRmJBm/DnjNOK');

INSERT INTO "public"."login" ("email", "hash") VALUES
('s@g.co', '$2a$10$dJJEvyZ0wMH3Lta9bWyPde1/1vfVNaC7uiXChls/bRmJBm/DnjNOK');

INSERT INTO "public"."login" ("email", "hash") VALUES
('shrxs@gml.com', '$2a$10$dJJEvyZ0wMH3Lta9bWyPde1/1vfVNaC7uiXChls/bRmJBm/DnjNOK');

COMMIT;