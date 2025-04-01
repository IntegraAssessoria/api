-- CreateEnum
CREATE TYPE "ProposalCustomerPeopleGender" AS ENUM ('FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "ProposalCustomerPeopleMaritalStatus" AS ENUM ('SINGLE', 'WIDOWED', 'DIVORCED', 'MARRIED');

-- CreateEnum
CREATE TYPE "ProposalCustomerPeopleOccupation" AS ENUM ('EMPLOYED', 'BUSINESS_OWNER_SELF_EMPLOYED', 'LIBERAL_PROFESSIONAL', 'RETIRED');

-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('FINANCING', 'REFINANCING');

-- CreateEnum
CREATE TYPE "ProposalVehicleType" AS ENUM ('CARS', 'VANS', 'TRUCKS_BUS', 'MOTORCYCLES');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('PEOPLE', 'COMPANY');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'STORE', 'CONSULTANT', 'AGENT');

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

-- CreateTable
CREATE TABLE "medias" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals_customers" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "mother-name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "gender" "ProposalCustomerPeopleGender" NOT NULL,
    "marital_status" TEXT NOT NULL,
    "spouse_name" TEXT,
    "spouse_cpf" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "occupation" "ProposalCustomerPeopleOccupation" NOT NULL,
    "profession" TEXT NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "zip_code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "company_cnpj" TEXT,
    "company_name" TEXT,
    "company_zip_code" TEXT,
    "company_address" TEXT,
    "company_city" TEXT,
    "company_state" TEXT,
    "billing_last-months" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "proposals_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals_messages" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposals_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "ProposalType" NOT NULL DEFAULT 'FINANCING',
    "vehicle_type" "ProposalVehicleType" NOT NULL,
    "new_vehicle" BOOLEAN NOT NULL,
    "plate" TEXT NOT NULL,
    "manufacturing_year" INTEGER NOT NULL,
    "model_year" INTEGER NOT NULL,
    "brand_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "fipe_codde" TEXT NOT NULL,
    "fipe_value" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "buy_value" DOUBLE PRECISION NOT NULL,
    "input_value" DOUBLE PRECISION NOT NULL,
    "financed_value" DOUBLE PRECISION NOT NULL,
    "payment_time" INTEGER NOT NULL,
    "installment_value" DOUBLE PRECISION NOT NULL,
    "customer_type" "CustomerType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "store_id" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT,
    "password" TEXT,
    "type" "UserType" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "first_access_token" VARCHAR(50),
    "first_access_token_expiration" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proposals_customers_proposalId_key" ON "proposals_customers"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_customerId_key" ON "proposals"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "proposals_customers" ADD CONSTRAINT "proposals_customers_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals_messages" ADD CONSTRAINT "proposals_messages_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
