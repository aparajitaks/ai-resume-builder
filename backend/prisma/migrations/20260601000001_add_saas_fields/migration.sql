-- CreateEnum (Plan)
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- AlterTable: add SaaS monetization columns to User
ALTER TABLE "User"
  ADD COLUMN "plan"             "Plan" NOT NULL DEFAULT 'FREE',
  ADD COLUMN "credits"          INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "subscriptionId"   TEXT;

-- CreateIndex (unique constraints)
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_subscriptionId_key"   ON "User"("subscriptionId");
