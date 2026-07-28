-- CreateTable
CREATE TABLE "StorefrontSectionProduct" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StorefrontSectionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StorefrontSectionProduct_pageKey_sectionKey_productId_key" ON "StorefrontSectionProduct"("pageKey", "sectionKey", "productId");

-- CreateIndex
CREATE INDEX "StorefrontSectionProduct_pageKey_sectionKey_displayOrder_idx" ON "StorefrontSectionProduct"("pageKey", "sectionKey", "displayOrder");

-- CreateIndex
CREATE INDEX "StorefrontSectionProduct_productId_idx" ON "StorefrontSectionProduct"("productId");

-- AddForeignKey
ALTER TABLE "StorefrontSectionProduct" ADD CONSTRAINT "StorefrontSectionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
