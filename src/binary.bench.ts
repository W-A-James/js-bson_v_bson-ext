import { Suite } from 'dbx-js-tools/packages/bson-bench';
import {
  getTestDocs,
  runSuiteAndWriteResults,
  BOOL,
  ITERATIONS,
  BSON_VERSIONS,
  BSONEXT_VERSIONS,
  WARMUP
} from './common';

async function main() {
  const suite = new Suite('Binary');
  const testDocs = await getTestDocs('binary');
  for (const library of BSON_VERSIONS.concat(BSONEXT_VERSIONS)) {
    // deserialize
    for (const documentPath of testDocs) {
      for (const promoteBuffers of BOOL) {
        suite.task({
          documentPath,
          library: library,
          iterations: ITERATIONS,
          warmup: WARMUP,
          operation: 'deserialize',
          options: {
            promoteBuffers
          }
        });
      }

      // serialize
      suite.task({
        documentPath,
        library: library,
        iterations: ITERATIONS,
        warmup: WARMUP,
        operation: 'serialize',
        options: { checkKeys: true, ignoreUndefined: false }
      });
    }
  }
  await runSuiteAndWriteResults(suite);
}

  main();
