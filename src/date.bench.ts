import { Suite } from 'dbx-js-tools/packages/bson-bench';
import {
  getTestDocs,
  runSuiteAndWriteResults,
  OPERATIONS,
  ITERATIONS,
  BSON_VERSIONS,
  BSONEXT_VERSIONS,
  WARMUP
} from './common';

const OPTIONS = {
  serialize: { checkKeys: true, ignoreUndefined: false },
  deserialize: {}
};

async function main() {
  const suite = new Suite('Date');
  const testDocs = await getTestDocs('date');

  for (const library of BSON_VERSIONS.concat(BSONEXT_VERSIONS)) {
  for (const operation of OPERATIONS) {
    for (const documentPath of testDocs) {
      suite.task({
        documentPath,
        library,
        iterations: ITERATIONS,
        warmup: WARMUP,
        operation,
        options: OPTIONS[operation]
      });
    }
  }
  }
  await runSuiteAndWriteResults(suite);
}
main();
