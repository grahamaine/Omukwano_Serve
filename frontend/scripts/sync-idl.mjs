// Copies the program interface into the serverless functions' folder.
import { readFileSync, writeFileSync } from 'node:fs'

const idl = JSON.parse(readFileSync(new URL('../src/idl/counter_program.json', import.meta.url), 'utf8'))
writeFileSync(
  new URL('../api/_lib/idl.ts', import.meta.url),
  `// Generated from src/idl/counter_program.json. Re-generate after changing the program:\n//   node scripts/sync-idl.mjs\n/* eslint-disable */\nexport const IDL: any = ${JSON.stringify(idl, null, 2)}\n`,
)
console.log(`api/_lib/idl.ts written (${idl.instructions.length} instructions)`)
