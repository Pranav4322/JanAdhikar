-- CreateTable
CREATE TABLE "ComplaintStatusLog" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintStatusLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComplaintStatusLog" ADD CONSTRAINT "ComplaintStatusLog_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
