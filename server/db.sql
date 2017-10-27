DROP DATABASE IF EXISTS notepad_wiki;
CREATE DATABASE         notepad_wiki;

\c notepad_wiki;

CREATE TABLE notes (
  ID SERIAL PRIMARY KEY,
  owner     VARCHAR(64) not null,
  name      VARCHAR(255) not null,
  header    VARCHAR(255),
  content   VARCHAR(8192),
  createdAt TIMESTAMP,
  editedAt  TIMESTAMP
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  user      VARCHAR(64) not null,
  hash      VARCHAR(255) not null,
  email     VARCHAR(255)
);
