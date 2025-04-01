/*
  Warnings:

  - You are about to drop the column `model_id` on the `proposals` table. All the data in the column will be lost.
  - Added the required column `model_fipe_id` to the `proposals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "proposals" DROP COLUMN "model_id",
ADD COLUMN     "model_fipe_id" TEXT NOT NULL;
