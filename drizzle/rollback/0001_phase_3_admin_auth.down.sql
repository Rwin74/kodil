-- DİKKAT: Yalnız Faz 3 öncesi uygulamaya dönülürken ve doğrulanmış DB yedeği
-- alındıktan sonra çalıştırın. Hesap parolaları, MFA sırları, kurtarma kodları,
-- doğrulama kayıtları ve aktif oturumlar kalıcı olarak silinir.
DROP TABLE IF EXISTS `auth_two_factors`;
DROP TABLE IF EXISTS `auth_accounts`;
DROP TABLE IF EXISTS `auth_verifications`;
DROP TABLE IF EXISTS `auth_rate_limits`;

ALTER TABLE `sessions` DROP COLUMN `ip_address`;
ALTER TABLE `sessions` DROP COLUMN `user_agent`;
ALTER TABLE `sessions` DROP COLUMN `updated_at`;
ALTER TABLE `users` DROP COLUMN `email_verified`;
ALTER TABLE `users` DROP COLUMN `image`;
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','editor','clinical_reviewer') NOT NULL;
