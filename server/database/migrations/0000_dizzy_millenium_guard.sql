CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`terms` integer NOT NULL,
	`shift` text NOT NULL,
	`uf` text NOT NULL,
	`hashed_password` text NOT NULL
);
