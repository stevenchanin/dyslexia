#!/usr/bin/env node
/*
  Lightweight validation for decodable text JSON files.
  Validates minimal schema without external deps.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'frontend', 'src', 'content', 'phonics');
const SEQUENCE_FILE = path.join(CONTENT_DIR, 'phonics-sequence.json');
const ALLOWED_TOKEN_TYPES = new Set(['word', 'punct', 'space', 'newline']);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && entry.name.endsWith('.json')) acc.push(p);
  }
  return acc;
}

function readJSON(file) {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    return { __error__: `Invalid JSON: ${e.message}` };
  }
}

function validateFile(file) {
  const errors = [];
  if (path.resolve(file) === path.resolve(SEQUENCE_FILE)) return errors; // skip scope file
  const data = readJSON(file);
  if (data.__error__) return [data.__error__];

  for (const key of ['id', 'title', 'stageId', 'language', 'tokens']) {
    if (!(key in data)) errors.push(`Missing required field '${key}'`);
  }
  if (!Array.isArray(data.tokens)) errors.push(`'tokens' must be an array`);
  if (Array.isArray(data.tokens)) {
    data.tokens.forEach((t, idx) => {
      if (typeof t !== 'object' || t === null) {
        errors.push(`tokens[${idx}] must be an object`);
        return;
      }
      if (!t.type || !ALLOWED_TOKEN_TYPES.has(t.type)) {
        errors.push(`tokens[${idx}].type must be one of ${Array.from(ALLOWED_TOKEN_TYPES).join(', ')}`);
      }
      if (typeof t.text !== 'string') {
        errors.push(`tokens[${idx}].text must be string`);
      }
      if (t.type === 'word') {
        if ('decodable' in t && typeof t.decodable !== 'boolean') {
          errors.push(`tokens[${idx}].decodable must be boolean if present`);
        }
        if ('unknownPatterns' in t && !Array.isArray(t.unknownPatterns)) {
          errors.push(`tokens[${idx}].unknownPatterns must be array if present`);
        }
      }
    });
  }
  return errors;
}

const files = walk(CONTENT_DIR);
let failed = 0;
for (const file of files) {
  const errs = validateFile(file);
  if (errs.length) {
    failed++;
    console.error(`\n[INVALID] ${path.relative(ROOT, file)}`);
    errs.forEach((e) => console.error(` - ${e}`));
  }
}

if (failed) {
  console.error(`\nValidation failed for ${failed} file(s).`);
  process.exit(1);
} else {
  console.log(`Validated ${files.length} file(s). No issues found.`);
}

