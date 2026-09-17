const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(__dirname, '..', 'public', 'photos', 'moments');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const photoData = [];

async function optimize() {
  console.log('Optimizing 11 photos...');
  for (let i = 1; i <= 11; i++) {
    const inputPath = path.join(inputDir, `${i}.png`);
    const outputPath = path.join(outputDir, `photo-${i}.webp`);

    if (!fs.existsSync(inputPath)) {
      console.error(`File not found: ${inputPath}`);
      continue;
    }

    const inputStat = fs.statSync(inputPath);

    // Read metadata
    const meta = await sharp(inputPath).metadata();
    
    // Max dimension 1600px for ultra-sharp Retina display while keeping file size small
    const pipeline = sharp(inputPath)
      .resize({
        width: meta.width > 1600 ? 1600 : undefined,
        height: meta.height > 1600 ? 1600 : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 88,
        effort: 6,
      });

    await pipeline.toFile(outputPath);
    const outputStat = fs.statSync(outputPath);

    console.log(
      `Photo ${i}: ${(inputStat.size / 1024 / 1024).toFixed(2)} MB -> ${(outputStat.size / 1024).toFixed(1)} KB (${(
        (1 - outputStat.size / inputStat.size) *
        100
      ).toFixed(1)}% reduction)`
    );

    photoData.push({
      id: i,
      src: `/photos/moments/photo-${i}.webp`,
      width: meta.width,
      height: meta.height,
      aspectRatio: (meta.width / meta.height).toFixed(3),
      isLandscape: meta.width > meta.height,
    });
  }

  fs.writeFileSync(
    path.join(outputDir, 'photos-manifest.json'),
    JSON.stringify(photoData, null, 2)
  );
  console.log('Optimization complete! Manifest generated.');
}

optimize().catch(console.error);
