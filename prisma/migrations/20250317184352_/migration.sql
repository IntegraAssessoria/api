/*
  Warnings:

  - You are about to drop the column `first_name` on the `stores` table. All the data in the column will be lost.
  - Added the required column `name` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stores" DROP COLUMN "first_name",
ADD COLUMN     "name" TEXT NOT NULL;
