import { Suite } from 'dbx-js-tools/packages/bson-bench';
import {
  runSuiteAndWriteResults,
  DOCUMENT_ROOT,
  BSON_VERSIONS,
  BSONEXT_VERSIONS,
  OPERATIONS,
  ITERATIONS,
  WARMUP
} from './common';
import * as path from 'path';

async function main() {
  const mixedDocuments: string[] = [
    'tweet.json',
    'bestbuy_medium.json',
    'deep_bson.json',
    'flat_bson.json',
    'full_bson.json',
    'mixed_small.json',
    'mixed_medium.json',
    'mixed_large.json',
    'nested_4.json',
    'nested_8.json',
    'nested_16.json'
  ].map(d => path.join(DOCUMENT_ROOT, d));
  const suite = new Suite('Mixed Documents');

  for (const library of BSON_VERSIONS.concat(BSONEXT_VERSIONS)) {
    for (const operation of OPERATIONS) {
      for (const documentPath of mixedDocuments) {
        suite.task({
          documentPath,
          library,
          iterations: ITERATIONS,
          warmup: WARMUP,
          operation,
          options: {}
        });
      }
    }
  }
  await runSuiteAndWriteResults(suite);
}
main();
