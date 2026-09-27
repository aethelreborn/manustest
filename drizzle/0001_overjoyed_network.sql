CREATE TABLE `billing_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'INR',
	`dueDate` varchar(10) NOT NULL,
	`cadence` enum('Monthly','Yearly','One-time') NOT NULL,
	`status` enum('upcoming','overdue','paid') NOT NULL DEFAULT 'upcoming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `billing_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vault_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`itemType` enum('password','card','note') NOT NULL,
	`encryptedPayload` text NOT NULL,
	`iv` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vault_items_id` PRIMARY KEY(`id`)
);
