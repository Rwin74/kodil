CREATE TABLE `post_working_copies` (
	`post_id` varchar(64) NOT NULL,
	`editor_id` varchar(64),
	`status` enum('draft','in_review','scheduled') NOT NULL DEFAULT 'draft',
	`snapshot` json NOT NULL,
	`content_hash` char(64) NOT NULL,
	`scheduled_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `post_working_copies_post_id` PRIMARY KEY(`post_id`)
);
--> statement-breakpoint
ALTER TABLE `editorial_reviews` ADD `content_hash` char(64);--> statement-breakpoint
ALTER TABLE `post_working_copies` ADD CONSTRAINT `post_working_copies_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_working_copies` ADD CONSTRAINT `post_working_copies_editor_id_users_id_fk` FOREIGN KEY (`editor_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `post_working_status_idx` ON `post_working_copies` (`status`,`scheduled_at`);