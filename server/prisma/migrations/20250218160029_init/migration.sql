-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Expense_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
