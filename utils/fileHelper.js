import fs from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join('./data');

export const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

export const readJsonFile = async (filename) => {
  await ensureDataDir();
  const filePath = join(DATA_DIR, filename);
  
  if (!existsSync(filePath)) {
    return [];
  }
  
  const data = await fs.readFile(filePath, 'utf-8');
  return data ? JSON.parse(data) : [];
};

export const writeJsonFile = async (filename, data) => {
  await ensureDataDir();
  const filePath = join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};


