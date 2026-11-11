function task1() {
  return new Promise(resolve => {
    const time = Math.random() * 800 + 200;
    setTimeout(() => {
      console.log("Task 1 done");
      resolve();
    }, time);
  });
}

function task2() {
  return new Promise(resolve => {
    const time = Math.random() * 800 + 200;
    setTimeout(() => {
      console.log("Task 2 done");
      resolve();
    }, time);
  });
}

function task3() {
  return new Promise(resolve => {
    const time = Math.random() * 800 + 200;
    setTimeout(() => {
      console.log("Task 3 done");
      resolve();
    }, time);
  });
}

async function runChain() {
  console.time("Total time");
  await task1()
    .then(() => task2())
    .then(() => task3());
  console.timeEnd("Total time");
}

runChain();
