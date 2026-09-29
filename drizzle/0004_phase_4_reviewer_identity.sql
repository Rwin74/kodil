ALTER TABLE `team_members` ADD `reviewer_user_id` varchar(64);--> statement-breakpoint
ALTER TABLE `team_members` ADD CONSTRAINT `team_reviewer_user_uq` UNIQUE(`reviewer_user_id`);--> statement-breakpoint
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_reviewer_user_id_users_id_fk` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;