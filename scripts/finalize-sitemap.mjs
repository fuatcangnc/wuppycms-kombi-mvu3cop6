import { existsSync, unlinkSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve('dist')
const generated = resolve(dist, 'sitemap-0.xml')
const sitemap = resolve(dist, 'sitemap.xml')

if (!existsSync(generated)) {
  console.log('Sitemap output not found; skipping.')
  process.exit(0)
}

renameSync(generated, sitemap)

const index = resolve(dist, 'sitemap-index.xml')
if (existsSync(index)) unlinkSync(index)

console.log('Single sitemap written to dist/sitemap.xml')
