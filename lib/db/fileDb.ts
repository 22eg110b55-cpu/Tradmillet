import path from "path";
import { promises as fs } from "fs";

type JsonValue = any;

const writeLocks = new Map<string, Promise<void>>();

const dataRoot = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

export function dataPath(fileName: string) {
  return path.join(dataRoot, fileName);
}

export async function readJsonFile<T = JsonValue>(absPath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(absPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function ensureDirForFile(absPath: string) {
  const dir = path.dirname(absPath);
  await fs.mkdir(dir, { recursive: true });
}

export async function writeJsonFile(absPath: string, data: JsonValue) {
  await ensureDirForFile(absPath);
  const tmp = `${absPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, absPath);
}

export async function withWriteLock<T>(absPath: string, fn: () => Promise<T>): Promise<T> {
  const prev = writeLocks.get(absPath) || Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  writeLocks.set(absPath, prev.then(() => current));

  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (writeLocks.get(absPath) === current) writeLocks.delete(absPath);
  }
}


