-- SQLite
DROP TABLE USER;

DROP TABLE Chat;

CREATE TABLE
    Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone VARCHAR(15),
        user_role VARCHAR(10) NOT NULL CHECK (user_role IN ('User', 'Admin', 'Superuser')),
        user_plan VARCHAR(10) NOT NULL CHECK (user_plan IN ('Trial', 'Basic', 'Premium')),
        password VARCHAR,
        location VARCHAR,
        profilePicture VARCHAR DEFAULT 'assets/ProfilePictureDefault/profile.png',
        googleId VARCHAR,
        authType VARCHAR NOT NULL DEFAULT 'direct'
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