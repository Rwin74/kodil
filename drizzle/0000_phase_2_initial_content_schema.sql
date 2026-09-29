CREATE TABLE `audit_logs` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`actor_id` varchar(64),
	`action` varchar(120) NOT NULL,
	`entity_type` varchar(120) NOT NULL,
	`entity_id` varchar(128) NOT NULL,
	`previous_revision_id` bigint unsigned,
	`new_revision_id` bigint unsigned,
	`context` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(64) NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`description` text,
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_uq` UNIQUE(`name`),
	CONSTRAINT `categories_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `credentials` (
	`id` varchar(64) NOT NULL,
	`team_member_id` varchar(64) NOT NULL,
	`kind` enum('education','expertise','external_profile') NOT NULL,
	`name` varchar(255) NOT NULL,
	`institution` varchar(255),
	`field` varchar(255),
	`source_url` varchar(1024) NOT NULL,
	`source_url_hash` char(64) NOT NULL,
	`verified_at` date NOT NULL,
	`evidence_reference` varchar(255),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `credentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `credentials_source_uq` UNIQUE(`team_member_id`,`kind`,`source_url_hash`)
);
--> statement-breakpoint
CREATE TABLE `editorial_reviews` (
	`id` varchar(64) NOT NULL,
	`post_id` varchar(64) NOT NULL,
	`reviewer_id` varchar(64) NOT NULL,
	`completed_at` date,
	`expertise_source_url` varchar(1024) NOT NULL,
	`evidence_reference` varchar(255) NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `editorial_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` varchar(64) NOT NULL,
	`storage_key` varchar(512) NOT NULL,
	`mime_type` varchar(128) NOT NULL,
	`byte_size` bigint unsigned NOT NULL,
	`width` int unsigned NOT NULL,
	`height` int unsigned NOT NULL,
	`alt_text` text NOT NULL,
	`caption` text,
	`context` text,
	`rights_status` enum('pending','verified','restricted') NOT NULL DEFAULT 'pending',
	`uploaded_by` varchar(64),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_storage_key_uq` UNIQUE(`storage_key`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` varchar(64) NOT NULL,
	`path` varchar(512) NOT NULL,
	`name` varchar(320) NOT NULL,
	`title` varchar(320) NOT NULL,
	`description` text NOT NULL,
	`schema_type` varchar(64),
	`content` mediumtext,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'published',
	`indexable` boolean NOT NULL DEFAULT true,
	`canonical_override` varchar(1024),
	`content_updated_at` date,
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_path_uq` UNIQUE(`path`)
);
--> statement-breakpoint
CREATE TABLE `post_revisions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`post_id` varchar(64) NOT NULL,
	`editor_id` varchar(64),
	`snapshot` json NOT NULL,
	`change_note` varchar(500),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `post_revisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(64) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(320) NOT NULL,
	`seo_title` varchar(320),
	`excerpt` text NOT NULL,
	`content` mediumtext NOT NULL,
	`status` enum('draft','in_review','scheduled','published','archived') NOT NULL DEFAULT 'draft',
	`published_at` date,
	`published_label` varchar(64),
	`content_updated_at` date,
	`content_updated_label` varchar(64),
	`author_id` varchar(64),
	`reviewer_id` varchar(64),
	`reviewed_at` date,
	`category_id` varchar(64) NOT NULL,
	`featured_media_id` varchar(64),
	`indexable` boolean NOT NULL DEFAULT false,
	`canonical_override` varchar(1024),
	`keywords` json NOT NULL,
	`image` json,
	`experience` json,
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` varchar(64) NOT NULL,
	`source_path` varchar(512) NOT NULL,
	`target_path` varchar(1024) NOT NULL,
	`http_code` int unsigned NOT NULL DEFAULT 308,
	`active` boolean NOT NULL DEFAULT true,
	`reason` varchar(500) NOT NULL,
	`validation_status` enum('pending','valid','invalid') NOT NULL DEFAULT 'pending',
	`checked_at` datetime,
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `redirects_id` PRIMARY KEY(`id`),
	CONSTRAINT `redirects_source_uq` UNIQUE(`source_path`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`expires_at` datetime NOT NULL,
	`revoked_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`last_seen_at` datetime,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_token_uq` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` varchar(120) NOT NULL,
	`value` json NOT NULL,
	`description` varchar(500),
	`updated_by` varchar(64),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`post_id` varchar(64) NOT NULL,
	`title` varchar(500) NOT NULL,
	`url` varchar(2048) NOT NULL,
	`url_hash` char(64) NOT NULL,
	`publisher` varchar(255),
	`verified_at` date,
	`usage_note` text,
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `sources_post_url_uq` UNIQUE(`post_id`,`url_hash`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` varchar(64) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(180) NOT NULL,
	`role` varchar(180) NOT NULL,
	`bio` text NOT NULL,
	`image_path` varchar(512) NOT NULL,
	`accent` varchar(64) NOT NULL,
	`verified_education` json NOT NULL,
	`verified_expertise` json NOT NULL,
	`verified_external_profiles` json NOT NULL,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'published',
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`featured_media_id` varchar(64),
	`content_updated_at` date,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`display_name` varchar(160) NOT NULL,
	`role` enum('admin','editor','clinical_reviewer') NOT NULL,
	`status` enum('invited','active','suspended') NOT NULL DEFAULT 'invited',
	`mfa_enabled` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`last_login_at` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actor_id_users_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `credentials` ADD CONSTRAINT `credentials_team_member_id_team_members_id_fk` FOREIGN KEY (`team_member_id`) REFERENCES `team_members`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `editorial_reviews` ADD CONSTRAINT `editorial_reviews_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `editorial_reviews` ADD CONSTRAINT `editorial_reviews_reviewer_id_team_members_id_fk` FOREIGN KEY (`reviewer_id`) REFERENCES `team_members`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_revisions` ADD CONSTRAINT `post_revisions_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_revisions` ADD CONSTRAINT `post_revisions_editor_id_users_id_fk` FOREIGN KEY (`editor_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_team_members_id_fk` FOREIGN KEY (`author_id`) REFERENCES `team_members`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_reviewer_id_team_members_id_fk` FOREIGN KEY (`reviewer_id`) REFERENCES `team_members`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_featured_media_id_media_id_fk` FOREIGN KEY (`featured_media_id`) REFERENCES `media`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sources` ADD CONSTRAINT `sources_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_featured_media_id_media_id_fk` FOREIGN KEY (`featured_media_id`) REFERENCES `media`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `audit_actor_idx` ON `audit_logs` (`actor_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `credentials_member_idx` ON `credentials` (`team_member_id`);--> statement-breakpoint
CREATE INDEX `reviews_post_idx` ON `editorial_reviews` (`post_id`,`status`);--> statement-breakpoint
CREATE INDEX `reviews_reviewer_idx` ON `editorial_reviews` (`reviewer_id`);--> statement-breakpoint
CREATE INDEX `pages_public_idx` ON `pages` (`status`,`indexable`,`sort_order`);--> statement-breakpoint
CREATE INDEX `post_revisions_post_idx` ON `post_revisions` (`post_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `posts_public_idx` ON `posts` (`status`,`indexable`,`published_at`);--> statement-breakpoint
CREATE INDEX `posts_category_idx` ON `posts` (`category_id`,`status`);--> statement-breakpoint
CREATE INDEX `posts_author_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `posts_reviewer_idx` ON `posts` (`reviewer_id`);--> statement-breakpoint
CREATE INDEX `redirects_active_idx` ON `redirects` (`active`,`sort_order`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_expiry_idx` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE INDEX `sources_post_idx` ON `sources` (`post_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `team_public_idx` ON `team_members` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `users_status_idx` ON `users` (`status`);