import { Suite } from 'dbx-js-tools/packages/bson-bench';
import * as path from 'path';
import * as fs from 'fs/promises';

export const DOCUMENT_ROOT = `${__dirname}/../documents`;
export const BSON_VERSIONS = [`bson@6.2.0`, `bson@5.5.1`, 'bson@4.7.2'];
export const BSONEXT_VERSIONS = ['bson-ext@4.0.3'];
export const OPERATIONS: ('serialize' | 'deserialize')[] = ['serialize', 'deserialize'];
export const BOOL = [true, false];

export const isDeserialize = (s: string) => s === 'deserialize';
export async function getTestDocs(type: string) {
  const docs = ['singleFieldDocument', 'singleElementArray'].map(testType =>
    path.join(DOCUMENT_ROOT, `${type}_${testType}.json`)
  );

  const dir = await fs.opendir(DOCUMENT_ROOT);
  const arrayRegex = new RegExp(`${type}_array_\\d+\\.json`);
  const sizedRegex = new RegExp(`${type}_(small|medium|large)\\.json`);
  for await (const entry of dir) {
    // Get array and sized docs
    if (arrayRegex.test(entry.name) || sizedRegex.test(entry.name)) {
      docs.push(path.join(DOCUMENT_ROOT, entry.name));
    }
  }

  return docs;
}

export async function runSuiteAndWriteResults(suite: Suite) {
  await suite.run();
  await suite.writeResults(`./etc/${suite.name.toLowerCase()}Results.json`);
}

export function readEnvVars(): { warmup: number; iterations: number } {
  const envWarmup = Number(process.env.WARMUP);
  const envIterations = Number(process.env.ITERATIONS);
  const rv = {
    warmup: Number.isSafeInteger(envWarmup) && envWarmup > 0 ? envWarmup : 100_000,
    iterations: Number.isSafeInteger(envIterations) && envIterations > 0 ? envIterations : 10_000
  };

  console.log(`warmup iterations: ${rv.warmup}\nmeasured iterations: ${rv.iterations}`);

  return rv;
}

const envVars = readEnvVars();
export const ITERATIONS = envVars.iterations;
export const WARMUP = envVars.warmup;
