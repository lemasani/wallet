/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Account_name_userId_key` ON `Account`(`name`, `userId`);
