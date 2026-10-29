import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

console.log('⚡ Starting high-efficiency Lighthouse Image Optimization...')

let totalSavedBytes = 0

function optimizeImage(inputPath, outputPath, resize, quality = 70, extraParams = '') {
  if (!fs.existsSync(inputPath)) return

  const initialSize = fs.statSync(inputPath).size
  const tempOutput = outputPath + '.tmp.webp'

  const resizeParam = resize ? `-resize ${resize}` : ''
  const cmd = `magick "${inputPath}" ${resizeParam} -strip -quality ${quality} -define webp:method=6 -define webp:auto-filter=true ${extraParams} "${tempOutput}"`

  try {
    execSync(cmd, { stdio: 'pipe' })
    if (fs.existsSync(tempOutput)) {
      fs.renameSync(tempOutput, outputPath)
      const finalSize = fs.statSync(outputPath).size
      const saved = initialSize - finalSize
      if (saved > 0) totalSavedBytes += saved
      console.log(`✅ [${path.basename(outputPath)}] ${(initialSize / 1024).toFixed(1)} KB ➔ ${(finalSize / 1024).toFixed(1)} KB (Saved: ${(saved / 1024).toFixed(1)} KB)`)
    }
  } catch (err) {
    console.error(`❌ Failed to optimize ${inputPath}:`, err.message)
  }
}

// 1. Optimize Hero Infographic
console.log('\n--- Optimizing Hero Infographic ---')
const infographicPng = path.join(rootDir, 'public/karakas-tse-surec-infografik.png')
const infographicWebp = path.join(rootDir, 'public/karakas-tse-surec-infografik.webp')
const infographicSource = fs.existsSync(infographicPng) ? infographicPng : infographicWebp

optimizeImage(infographicSource, infographicWebp, '960x', 62)

// High-efficiency 600px mobile version
const infographicMobileWebp = path.join(rootDir, 'public/karakas-tse-surec-infografik-520.webp')
optimizeImage(infographicSource, infographicMobileWebp, '600x', 45, '-define webp:filter-strength=25')

// 2. Optimize Hizmetler Service Images (16:9 widescreen)
console.log('\n--- Optimizing Service Card Images (hizmetler/) ---')
const hizmetlerDir = path.join(rootDir, 'public/hizmetler')
if (fs.existsSync(hizmetlerDir)) {
  const files = fs.readdirSync(hizmetlerDir)
  for (const file of files) {
    if (/-\d+(x\d+)?\.webp$/i.test(file)) continue
    if (file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')) {
      const filePath = path.join(hizmetlerDir, file)
      const outWebp = path.join(hizmetlerDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'))
      optimizeImage(filePath, outWebp, '960x540', 70)
      const smallWebp = path.join(hizmetlerDir, file.replace(/\.(png|jpg|jpeg|webp)$/i, '-520.webp'))
      optimizeImage(filePath, smallWebp, '600x338', 45, '-define webp:filter-strength=25')
    }
  }
}

// 3. Optimize Media Images (cekidemiri etc.)
console.log('\n--- Optimizing Media Images (media/) ---')
const mediaDir = path.join(rootDir, 'public/media')
if (fs.existsSync(mediaDir)) {
  const cekiJpg = path.join(mediaDir, 'cekidemiri.jpg')
  const cekiWebp = path.join(mediaDir, 'cekidemiri.webp')
  const cekiSource = fs.existsSync(cekiJpg) ? cekiJpg : cekiWebp
  optimizeImage(cekiSource, cekiWebp, '960x540', 70)
  optimizeImage(cekiSource, path.join(mediaDir, 'cekidemiri-520.webp'), '600x338', 45, '-define webp:filter-strength=25')
}

// 3b. Generate responsive variants for extra service images
console.log('\n--- Optimizing Extra Service Images ---')
const extraServiceImages = ['public/images/scooter-canta-ruhsata-isletme.webp']
for (const rel of extraServiceImages) {
  const filePath = path.join(rootDir, rel)
  if (!fs.existsSync(filePath)) continue
  optimizeImage(filePath, filePath, '960x540', 70)
  optimizeImage(filePath, filePath.replace(/\.webp$/i, '-520.webp'), '600x338', 45, '-define webp:filter-strength=25')
}

// 4. Optimize Car Banner
console.log('\n--- Optimizing Car Banner ---')
const bannerWebp = path.join(rootDir, 'public/car-banner-1024x462.webp')
optimizeImage(bannerWebp, bannerWebp, '680x307', 68)

// 5. Optimize CTA / FAQ Banners
console.log('\n--- Optimizing Section Banners ---')
const ctaWebp = path.join(rootDir, 'public/arac-proje-cta.webp')
const faqWebp = path.join(rootDir, 'public/arac-proje-hizmetleri-sik-sorulan-sorular.webp')
optimizeImage(ctaWebp, ctaWebp, '650x', 68)
optimizeImage(faqWebp, faqWebp, '650x', 68)

// 6. Optimize Header Logo
console.log('\n--- Optimizing Header Logo ---')
const logoWebp = path.join(rootDir, 'public/karakasmuhendislik-logo.webp')
optimizeImage(logoWebp, logoWebp, '1086x362', 78)

console.log(`\n🎉 All images optimized successfully!`)
console.log(`🚀 Total bandwidth saved for user: ${(totalSavedBytes / 1024).toFixed(1)} KB (~${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB)`)
