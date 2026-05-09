#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distIndex = path.resolve(__dirname, '..', 'dist', 'index.html');
try {
  let html = fs.readFileSync(distIndex, 'utf8');
  const timestamp = new Date().toISOString();
  const comment = `<!-- build_timestamp: ${timestamp} -->\n`;
  if (html.includes('build_timestamp:')) {
    html = html.replace(/<!-- build_timestamp:.*?-->\n?/, comment);
  } else {
    html = comment + html;
  }
  fs.writeFileSync(distIndex, html, 'utf8');
  console.log('Injected build timestamp:', timestamp);
} catch (e) {
  console.error('Failed to inject build timestamp:', e.message);
  // Don't fail the build if dist/index.html doesn't exist (e.g., running locally before build)
  process.exit(0);
}
