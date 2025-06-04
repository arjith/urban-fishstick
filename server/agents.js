import fs from 'fs/promises';
import fetch from 'node-fetch';

export async function browse(url) {
  const res = await fetch(url);
  return res.text();
}

export async function readFile(path) {
  return fs.readFile(path, 'utf8');
}

export async function writeFile(path, content) {
  await fs.writeFile(path, content, 'utf8');
  return 'written';
}
