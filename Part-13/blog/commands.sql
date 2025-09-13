CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Dan Abramov', 'https://overreacted.io/let-vs-const/', 'On let vs const', 0);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Laurenz Albe', 'https://wiki.postgresql.org/wiki/Fixing_Sequences', 'Gaps in sequences in PostgreSQL', 0);