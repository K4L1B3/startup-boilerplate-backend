-- SQLite
DROP TABLE Users;

DROP TABLE Chat;

UPDATE Users SET role = 'Admin' WHERE id = 2;

CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  password TEXT,
  location TEXT,
  role TEXT DEFAULT 'User' CHECK(role IN ('User', 'Admin')),
  plan TEXT DEFAULT 'Basic' CHECK(plan IN ('Yellow', 'HeartGold', 'Emerald')),
  profilePicture TEXT DEFAULT 'assets/ProfilePictureDefault/profile.png',
  googleId TEXT,
  authType TEXT NOT NULL DEFAULT 'direct',
  stripeCustomerId TEXT,
  subscriptionStatus TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE
    CodePass (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        userId INTEGER NOT NULL,
        code VARCHAR NOT NULL,
        expirationDate TIMESTAMP NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users (id)
    );

CREATE TABLE
    Chat (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        userId INTEGER NOT NULL,
        name VARCHAR NOT NULL,
        menssageHistory TEXT,
        chatStart TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        chatEnd TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        newAnswer text NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users (id)
    );