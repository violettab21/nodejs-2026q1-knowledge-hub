/*
  Warnings:

  - You are about to drop the `TagsOnArticle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TagsOnArticle" DROP CONSTRAINT "TagsOnArticle_articleId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnArticle" DROP CONSTRAINT "TagsOnArticle_tagId_fkey";

-- DropTable
DROP TABLE "TagsOnArticle";

-- CreateTable
CREATE TABLE "_TagsOnArticle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagsOnArticle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TagsOnArticle_B_index" ON "_TagsOnArticle"("B");

-- AddForeignKey
ALTER TABLE "_TagsOnArticle" ADD CONSTRAINT "_TagsOnArticle_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsOnArticle" ADD CONSTRAINT "_TagsOnArticle_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
