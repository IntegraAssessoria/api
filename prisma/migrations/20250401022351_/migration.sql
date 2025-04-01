/*
  Warnings:

  - Changed the type of `marital_status` on the `proposals_customers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProposalCustomerMaritalStatus" AS ENUM ('SINGLE', 'WIDOWED', 'SEPARATED', 'MARRIED');

-- AlterTable
ALTER TABLE "proposals_customers" ADD COLUMN     "rent" TEXT,
DROP COLUMN "marital_status",
ADD COLUMN     "marital_status" "ProposalCustomerMaritalStatus" NOT NULL;
