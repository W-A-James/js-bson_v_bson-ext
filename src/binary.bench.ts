import { Suite } from 'dbx-js-tools/packages/bson-bench';
import {
  getTestDocs,
  runSuiteAndWriteResults,
  BSON_VERSIONS,
  BSONEXT_VERSIONS,
  OPERATIONS,
  BOOL,
  ITERATIONS,
  WARMUP
} from './common';

async function main() {
  const suite = new Suite('Binary');
  const testDocs = await getTestDocs('binary');
  for (const library of BSON_VERSIONS.concat(BSONEXT_VERSIONS)) {
    for (const operation of OPERATIONS) {
      for (const documentPath of testDocs) {
        for (const promoteBuffers of BOOL) {
          suite.task({
            documentPath,
            library,
            iterations: ITERATIONS,
            warmup: WARMUP,
            operation,
            options: {
              promoteBuffers
            }
          });
        }
      }
    }
  }
  await runSuiteAndWriteResults(suite);
}

main();