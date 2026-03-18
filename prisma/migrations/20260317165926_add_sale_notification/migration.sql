-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'SALE';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "orderItemId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
