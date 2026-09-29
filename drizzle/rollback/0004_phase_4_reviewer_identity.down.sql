ALTER TABLE `team_members` DROP FOREIGN KEY `team_members_reviewer_user_id_users_id_fk`;
ALTER TABLE `team_members` DROP INDEX `team_reviewer_user_uq`;
ALTER TABLE `team_members` DROP COLUMN `reviewer_user_id`;
