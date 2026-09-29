# Vercel yönetim paneli hazırlığı

Yönetim ekranları `/yonetim/giris` altında çalışır. Kimlik doğrulama ve içerik verileri için Vercel Production ve Preview ortamlarında ayrı değerler tanımlayın; gerçek değerleri GitHub’a koymayın.

Gerekli değişken adları: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `PREVIEW_SIGNING_SECRET`, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, `CONTENT_SOURCE=mysql`, `MEDIA_ROOT`.

Bu kaynak sürümündeki MySQL bağlantısı, uzak production MySQL için `DATABASE_TLS_CA_FILE` mutlak dosya yolu ister. Medya servisi de kalıcı, yazılabilir `MEDIA_ROOT` ister. Vercel Functions yerel diski bu amaçlar için kalıcı değildir; bu yüzden panelin tam çalışması için MySQL’e Vercel’den erişim ve kalıcı medya deposu uyarlaması gerekir. Vercel’e sıradan bir cPanel dosya yolu vermek yeterli olmaz.

Değişkenleri tanımladıktan sonra veritabanı migration’ları uygulanmalı, mevcut içerik güvenli biçimde içe aktarılmalı ve ilk admin hesabı oluşturulmalıdır. Parola sıfırlama e-postası SMTP üzerinden gönderilir, MFA etkinleştirmesi kullanıcı tarafından tamamlanır.
