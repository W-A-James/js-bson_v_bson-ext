import { Suite } from 'dbx-js-tools/packages/bson-bench';
import {
  getTestDocs,
  runSuiteAndWriteResults,
  BSON_VERSIONS,
  BSONEXT_VERSIONS,
  BOOL,
  ITERATIONS,
  WARMUP
} from './common';

const OPTIONS = {
  serialize: { checkKeys: true, ignoreUndefined: false },
  deserialize: {
    promoteValues: true,
    index: 0,
    evalFunctions: false,
    cacheFunctions: false,
    allowObjectSmallerThanBufferSize: false
  }
};

async function main() {
  const suite = new Suite('Int32');
  const testDocs = await getTestDocs('int32');
  for (const library of BSON_VERSIONS.concat(BSONEXT_VERSIONS)) {
    for (const documentPath of testDocs) {
      // deserialize
      for (const promoteValues of BOOL) {
        suite.task({
          documentPath,
          library,
          iterations: ITERATIONS,
          warmup: WARMUP,
          operation: 'deserialize',
          options: { ...OPTIONS.deserialize, promoteValues }
        });
      }
      //serialize
      suite.task({
        documentPath,
        library,
        iterations: ITERATIONS,
        warmup: WARMUP,
        operation: 'serialize',
        options: OPTIONS.serialize
      });
    }
  }
  await runSuiteAndWriteResults(suite);
}
main();
