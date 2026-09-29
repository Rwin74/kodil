-- DİKKAT: Bu dosya yalnız Faz 2 öncesi uygulama sürümüne geri dönülürken ve
-- doğrulanmış DB yedeği alındıktan sonra çalıştırılmalıdır. Tüm CMS tablolarını
-- ve içlerindeki veriyi siler.
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `sources`;
DROP TABLE IF EXISTS `editorial_reviews`;
DROP TABLE IF EXISTS `post_revisions`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `credentials`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `pages`;
DROP TABLE IF EXISTS `redirects`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `__drizzle_migrations`;
