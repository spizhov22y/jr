import { spawn } from "child_process";

// Function to delay for a specified amount of time
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to run a single test file
async function runTest(testFile, isHeaded = false) {
  return new Promise((resolve) => {
    const headedOption = isHeaded ? "--headed" : "";
    const command = `npx playwright test ${testFile} ${headedOption}`;

    const testProcess = spawn(command, { shell: true });

    // Stream stdout (console logs) to the terminal
    testProcess.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    // Stream stderr (errors) to the terminal
    testProcess.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    // Handle process exit
    testProcess.on("exit", (code) => {
      if (code === 0) {
        console.log(`Successfully ran ${testFile}`);
      } else {
        console.error(`Error running ${testFile}, exit code: ${code}`);
      }
      resolve(); // Resolve regardless of success or failure
    });
  });
}

// Function to run all tests with delays and repetition
async function runTestsWithDelayAndRepeat(isHeaded = false) {
  const testFiles = [
    "tests/test-13.spec.ts",
    // "tests/test-2.spec.ts",
    // "tests/test-3.spec.ts",
    // "tests/test-4.spec.ts",
    // "tests/test-5.spec.ts",
    // "tests/test-6.spec.ts",
    // "tests/test-7.spec.ts",
    // "tests/test-8.spec.ts",
  ];

  const repetitions = 20; // Number of times to run the tests

  for (let i = 0; i < repetitions; i++) {
    console.log(`Running all tests, repetition ${i + 1} of ${repetitions}`);
    for (const testFile of testFiles) {
      console.log(`Running ${testFile}`);
      await runTest(testFile, isHeaded); // Run each test in headed mode if set to true
      const delayTime = Math.floor(Math.random() * (30000 - 7000 + 1)) + 7000; // Random delay between 7 to 30 seconds
      console.log(
        `Waiting for ${
          delayTime / 1000
        } seconds before running the next test...`
      );
      await delay(delayTime); // Wait for the generated delay
    }
  }

  console.log("Finished running all tests");
}

// Execute the test runner in headed mode (set to true for headed mode)
runTestsWithDelayAndRepeat(true);
