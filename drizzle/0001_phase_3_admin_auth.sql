CREATE TABLE `auth_accounts` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`issuer` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` datetime,
	`refresh_token_expires_at` datetime,
	`scope` text,
	`password` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `auth_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_accounts_identity_uq` UNIQUE(`issuer`,`account_id`)
);
--> statement-breakpoint
CREATE TABLE `auth_rate_limits` (
	`id` varchar(64) NOT NULL,
	`rate_key` varchar(255) NOT NULL,
	`count` int unsigned NOT NULL,
	`last_request` bigint unsigned NOT NULL,
	CONSTRAINT `auth_rate_limits_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_rate_limits_key_uq` UNIQUE(`rate_key`)
);
--> statement-breakpoint
CREATE TABLE `auth_two_factors` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`secret` varchar(512) NOT NULL,
	`backup_codes` text NOT NULL,
	`verified` boolean NOT NULL DEFAULT true,
	`failed_verification_count` int unsigned NOT NULL DEFAULT 0,
	`locked_until` datetime,
	CONSTRAINT `auth_two_factors_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_two_factors_user_uq` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `auth_verifications` (
	`id` varchar(64) NOT NULL,
	`identifier` varchar(320) NOT NULL,
	`value` text NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `auth_verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','editor','clinical_reviewer') NOT NULL DEFAULT 'editor';--> statement-breakpoint
ALTER TABLE `sessions` ADD `ip_address` varchar(64);--> statement-breakpoint
ALTER TABLE `sessions` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `sessions` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `image` varchar(1024);--> statement-breakpoint
ALTER TABLE `auth_accounts` ADD CONSTRAINT `auth_accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_two_factors` ADD CONSTRAINT `auth_two_factors_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `auth_accounts_user_idx` ON `auth_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `auth_two_factors_secret_idx` ON `auth_two_factors` (`secret`);--> statement-breakpoint
CREATE INDEX `auth_verifications_identifier_idx` ON `auth_verifications` (`identifier`);