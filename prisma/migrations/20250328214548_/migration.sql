/*
  Warnings:

  - The values [VANS] on the enum `ProposalVehicleType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `payment_time` on the `proposals` table. All the data in the column will be lost.
  - Added the required column `installment_time` to the `proposals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProposalVehicleType_new" AS ENUM ('CARS', 'TRUCKS_BUS', 'MOTORCYCLES');
ALTER TABLE "proposals" ALTER COLUMN "vehicle_type" TYPE "ProposalVehicleType_new" USING ("vehicle_type"::text::"ProposalVehicleType_new");
ALTER TYPE "ProposalVehicleType" RENAME TO "ProposalVehicleType_old";
ALTER TYPE "ProposalVehicleType_new" RENAME TO "ProposalVehicleType";
DROP TYPE "ProposalVehicleType_old";
COMMIT;

-- AlterTable
ALTER TABLE "proposals" DROP COLUMN "payment_time",
ADD COLUMN     "installment_time" INTEGER NOT NULL;
