import { Suite } from 'dbx-js-tools/packages/bson-bench';
import {
  getTestDocs,
  runSuiteAndWriteResults,
  ITERATIONS,
  WARMUP,
  BOOL,
  BSON_VERSIONS,
  BSONEXT_VERSIONS
} from './common';

async function main() {
  const suite = new Suite('String');

  const testDocs = await getTestDocs('string');

  for (const library of BSON_VERSIONS) {
    // deserialize
    for (const documentPath of testDocs) {
      for (const utf8 of BOOL) {
        suite.task({
          documentPath,
          library,
          iterations: ITERATIONS,
          warmup: WARMUP,
          operation: 'deserialize',
          options: { validation: { utf8 } }
        });
      }
    }
    // serialize
    for (const documentPath of testDocs) {
      suite.task({
        documentPath,
        library,
        iterations: ITERATIONS,
        warmup: WARMUP,
        operation: 'serialize',
        options: { checkKeys: true, ignoreUndefined: false }
      });
    }
  }

  for (const library of BSONEXT_VERSIONS) {
    // deserialize
    for (const documentPath of testDocs) {
      suite.task({
        documentPath,
        library,
        iterations: ITERATIONS,
        warmup: WARMUP,
        operation: 'deserialize',
        options: {}
      });
    }
    // serialize
    for (const documentPath of testDocs) {
      suite.task({
        documentPath,
        library,
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
