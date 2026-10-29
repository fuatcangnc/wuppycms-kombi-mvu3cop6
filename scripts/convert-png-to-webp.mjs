import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const targetDir = process.argv[2] 
  ? path.resolve(rootDir, process.argv[2])
  : path.resolve(rootDir, 'public/car')

console.log(`🔍 Scanning directory for PNG files: ${targetDir}`)

if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory not found: ${targetDir}`)
  process.exit(1)
}

const files = fs.readdirSync(targetDir)
const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'))

if (pngFiles.length === 0) {
  console.log('ℹ️ No PNG files found to convert.')
  process.exit(0)
}

console.log(`🚀 Found ${pngFiles.length} PNG file(s). Converting to WebP...`)

let totalOriginalSize = 0
let totalWebpSize = 0

for (const pngFile of pngFiles) {
  const inputPath = path.join(targetDir, pngFile)
  const webpFileName = pngFile.replace(/\.png$/i, '.webp')
  const outputPath = path.join(targetDir, webpFileName)

  const originalStats = fs.statSync(inputPath)
  totalOriginalSize += originalStats.size

  try {
    // Convert PNG to WebP with 90% quality and lossless alpha preservation
    execSync(`magick "${inputPath}" -quality 90 -define webp:lossless=false -define webp:method=6 "${outputPath}"`, {
      stdio: 'inherit'
    })

    const webpStats = fs.statSync(outputPath)
    totalWebpSize += webpStats.size

    const savings = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1)
    console.log(`✅ ${pngFile} (${(originalStats.size / 1024).toFixed(1)} KB) ➔ ${webpFileName} (${(webpStats.size / 1024).toFixed(1)} KB) [${savings}% smaller]`)
  } catch (err) {
    console.error(`❌ Failed to convert ${pngFile}:`, err)
  }
}

const totalSavings = (((totalOriginalSize - totalWebpSize) / totalOriginalSize) * 100).toFixed(1)
console.log(`\n🎉 Conversion complete!`)
console.log(`📊 Total PNG size: ${(totalOriginalSize / 1024).toFixed(1)} KB`)
console.log(`📊 Total WebP size: ${(totalWebpSize / 1024).toFixed(1)} KB`)
console.log(`⚡ Overall reduction: ${totalSavings}%`)
