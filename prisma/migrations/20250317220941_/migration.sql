/*
  Warnings:

  - You are about to drop the `banks_channels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "banks_channels";

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);
