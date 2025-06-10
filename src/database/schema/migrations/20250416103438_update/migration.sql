/*
  Warnings:

  - You are about to drop the column `authorId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `_tag_to_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_tag_to_posts" DROP CONSTRAINT "_tag_to_posts_A_fkey";

-- DropForeignKey
ALTER TABLE "_tag_to_posts" DROP CONSTRAINT "_tag_to_posts_B_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_categoryId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authorId",
DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "_tag_to_posts";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "tags";
