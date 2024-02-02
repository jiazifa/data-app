-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "parentId" INTEGER,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT,
    "birthday" DATETIME,
    "email" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "gender" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "moneyFen" INTEGER NOT NULL,
    "budgetIdf" TEXT,
    "inOrOut" TEXT,
    "userIdf" TEXT,
    "flowStatus" TEXT,
    "payType" TEXT,
    "payDetail" TEXT,
    "counterparty" TEXT,
    "orderId" TEXT,
    "productInfo" TEXT,
    "spendAt" DATETIME,
    "remark" TEXT,
    "sourceRaw" TEXT,
    "isDeleted" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Category_id_title_idx" ON "Category"("id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_identifier_key" ON "Bill"("identifier");
