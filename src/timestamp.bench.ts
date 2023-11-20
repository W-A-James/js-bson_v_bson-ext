import { Suite } from 'dbx-js-tools/packages/bson-bench';
import {
  getTestDocs,
  runSuiteAndWriteResults,
  OPERATIONS,
  ITERATIONS,
  WARMUP,
  BSON_VERSIONS,
  BSONEXT_VERSIONS
} from './common';

async function main() {
  const suite = new Suite('Timestamp');
  const testDocs = await getTestDocs('timestamp');

  for (const library of BSON_VERSIONS.concat(BSONEXT_VERSIONS)) {
    for (const operation of OPERATIONS) {
      for (const documentPath of testDocs) {
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
