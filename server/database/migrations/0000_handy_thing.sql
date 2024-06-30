CREATE TABLE `emailVerification` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`code` text NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`expiresAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`phone` text,
	`email` text,
	`terms` integer,
	`shift` text,
	`uf` text,
	`hashedPassword` text NOT NULL,
	`emailVerified` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);