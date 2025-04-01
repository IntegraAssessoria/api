/*
  Warnings:

  - You are about to drop the column `brand_id` on the `proposals` table. All the data in the column will be lost.
  - Added the required column `brand_fipe_code` to the `proposals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "proposals" DROP COLUMN "brand_id",
ADD COLUMN     "brand_fipe_code" TEXT NOT NULL;
