function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function testDelay() {
  console.log("Start");
  await delay(2000);
  console.log("This prints after 2 seconds");
}

testDelay();
