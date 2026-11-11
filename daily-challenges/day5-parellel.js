async function fetchAllParallel() {
  const urls = [
    "https://jsonplaceholder.typicode.com/users/1",
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/comments/1"
  ];

  const promises = urls.map(url => 
    fetch(url).then(res => {
      if (!res.ok) throw new Error(`Failed ${url}`);
      return res.json();
    })
  );

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`API ${index + 1} success:`, result.value);
    } else {
      console.log(`API ${index + 1} failed:`, result.reason);
    }
  });
}

fetchAllParallel();
