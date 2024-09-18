-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sub" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/chatapp-4deee.appspot.com/o/ProfilePics%2Fdefault-pic.jpg?alt=media&token=53c51d35-079f-4e2e-addc-c6b40cfe8630',
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
