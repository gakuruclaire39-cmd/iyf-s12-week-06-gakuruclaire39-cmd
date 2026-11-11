// callback version (old)
function getDataCallback(id, callback) {
  setTimeout(() => {
    callback({ id: id, name: "John" });
  }, 1000);
}

// async/await version (new)
function getDataPromise(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: id, name: "John" });
    }, 1000);
  });
}

async function getDataAsync(id) {
  try {
    const data = await getDataPromise(id);
    console.log("Got data:", data);
    return data;
  } catch (error) {
    console.log("Failed:", error);
  }
}

getDataAsync(1);
