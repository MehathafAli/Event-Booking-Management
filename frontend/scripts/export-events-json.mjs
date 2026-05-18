import { writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import sampleEvents from '../src/data/events.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(
  __dirname,
  '../../backend/events/fixtures/sample_events.json'
)

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, JSON.stringify(sampleEvents, null, 2), 'utf-8')
console.log(`Exported ${sampleEvents.length} events to ${outputPath}`)
