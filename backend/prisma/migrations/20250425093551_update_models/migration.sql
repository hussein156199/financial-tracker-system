/*
  Warnings:

  - You are about to drop the `User_info` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User_info";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Userinfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_budget" REAL NOT NULL DEFAULT 0,
    "payments" REAL NOT NULL DEFAULT 0,
    "remaining_budget" REAL NOT NULL DEFAULT 0
);
