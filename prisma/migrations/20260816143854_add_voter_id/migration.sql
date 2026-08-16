/*
  Warnings:

  - A unique constraint covering the columns `[voterId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voterId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVoterVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "voterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_voterId_key" ON "User"("voterId");
