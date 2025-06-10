-- CreateTable
CREATE TABLE "User_info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_budget" REAL NOT NULL DEFAULT 0,
    "payments" REAL NOT NULL DEFAULT 0,
    "remaining_budget" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
