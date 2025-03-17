-- AlterTable
ALTER TABLE "users" ADD COLUMN     "first_access_token" VARCHAR(50),
ADD COLUMN     "first_access_token_expiration" TIMESTAMPTZ;
