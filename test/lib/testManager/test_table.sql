CREATE TABLE IF NOT EXISTS "test_table" (
  "id" INT,
  "name" VARCHAR,
  "score" INT
);

INSERT INTO "test_table" (id, name, score) VALUES
  ( 1, 'A', 64 ),
  ( 2, 'A', 88 ),
  ( 3, 'B', 82 ),
  ( 4, 'B', 72 )
;
