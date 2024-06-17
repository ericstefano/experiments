CREATE TABLE `email_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`code` text,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
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
	`hashed_password` text,
	`email_verified` integer
);
