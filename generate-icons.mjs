import sharp from "sharp";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ikonkalar saqlanadigan papka
const outputDir = join(__dirname, "public", "icons");

// Agar papka bo'lmasa — yaratamiz
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Manba rasm
const sourceImage = join(__dirname, "public", "images", "mikan-logo.png");

// PWA uchun kerakli o'lchamlar
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log("🎨 Ikonkalar yaratilmoqda...\n");

for (const size of sizes) {
  const outputFile = join(outputDir, `icon-${size}x${size}.png`);

  await sharp(sourceImage)
    .resize(size, size, {
      fit: "contain",        // Rasmni cho'zmaydi, proporsiyani saqlaydi
      background: { r: 255, g: 255, b: 255, alpha: 0 }, // Shaffof fon
    })
    .png()
    .toFile(outputFile);

  console.log(`✅ icon-${size}x${size}.png yaratildi`);
}

// Apple Touch Icon (iOS uchun alohida — oq fon bilan)
await sharp(sourceImage)
  .resize(180, 180, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 }, // iOS uchun oq fon
  })
  .png()
  .toFile(join(outputDir, "apple-touch-icon.png"));

console.log(`✅ apple-touch-icon.png yaratildi`);

console.log("\n🎉 Barcha ikonkalar tayyor: public/icons/ papkasida");
