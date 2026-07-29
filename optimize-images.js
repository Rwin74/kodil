/**
 * Görsel Optimizasyon Script'i
 * ----------------------------
 * public/ klasöründeki tüm .jpg, .jpeg, .png görsellerini bulur,
 * sıkıştırır ve yanlarına .webp versiyonunu oluşturur.
 * Orijinal dosyaları SİLMEZ, sadece yanına optimize edilmiş kopya ekler
 * ve orijinali de kalitesini düşürerek küçültür.
 *
 * KULLANIM:
 * 1) Proje klasörünün (kodil-main) köküne bu dosyayı kopyala.
 * 2) Terminalde şunu çalıştır:
 *      npm install sharp --save-dev
 *      (veya: pnpm add -D sharp)
 * 3) Sonra çalıştır:
 *      node optimize-images.js
 * 4) İşlem bitince kod içindeki <img> / next/image referanslarını
 *    gerekiyorsa .webp uzantısına güncelle (opsiyonel, next/image zaten
 *    formats ayarına göre otomatik webp/avif sunar, bu adım şart değil).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_WIDTH = 1920; // Bu genişlikten büyük görseller küçültülür
const JPEG_QUALITY = 75;
const PNG_QUALITY = 75;
const WEBP_QUALITY = 75;

const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

let totalOriginalSize = 0;
let totalNewSize = 0;
let processedCount = 0;

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!VALID_EXTENSIONS.includes(ext)) return;

  const originalSize = fs.statSync(filePath).size;
  totalOriginalSize += originalSize;

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = image;

  // Çok büyük görselleri yeniden boyutlandır
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH });
  }

  // Orijinal formatta sıkıştırılmış halini üzerine yaz
  const tempPath = filePath + '.tmp';
  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(tempPath);
  } else if (ext === '.png') {
    await pipeline
      .png({ quality: PNG_QUALITY, compressionLevel: 9 })
      .toFile(tempPath);
  }
  fs.renameSync(tempPath, filePath);

  const newSize = fs.statSync(filePath).size;
  totalNewSize += newSize;

  // Ayrıca .webp versiyonunu da oluştur (next/image bunu otomatik kullanabilir)
  const webpPath = filePath.replace(ext, '.webp');
  await sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(webpPath);

  processedCount++;
  const savedKB = ((originalSize - newSize) / 1024).toFixed(1);
  console.log(
    `✔ ${path.relative(PUBLIC_DIR, filePath)}  (${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB, tasarruf: ${savedKB}KB)`
  );
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error('HATA: "public" klasörü bulunamadı. Bu script\'i proje kökünde çalıştırdığından emin ol.');
    process.exit(1);
  }

  const filesToProcess = [];
  walkDir(PUBLIC_DIR, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (VALID_EXTENSIONS.includes(ext)) {
      filesToProcess.push(filePath);
    }
  });

  console.log(`${filesToProcess.length} görsel bulundu. Optimize ediliyor...\n`);

  for (const filePath of filesToProcess) {
    try {
      await optimizeImage(filePath);
    } catch (err) {
      console.error(`✘ HATA (${filePath}):`, err.message);
    }
  }

  console.log('\n--- ÖZET ---');
  console.log(`İşlenen görsel sayısı: ${processedCount}`);
  console.log(`Toplam eski boyut: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Toplam yeni boyut: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Toplam tasarruf: ${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log('\nNot: Her görselin yanına aynı isimde bir .webp kopyası da oluşturuldu.');
}

main();
