async function fetchUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (response.status === 404) {
      return { id: 0, name: "Default User", email: "default@example.com" };
    }
    if (!response.ok) {
      throw new Error("Fetch failed");
    }
    return await response.json();
  } catch (error) {
    console.log("Error, returning default:", error.message);
    return { id: 0, name: "Default User", email: "default@example.com" };
  }
}

async function testUsers() {
  const user1 = await fetchUser(1);
  console.log("User 1:", user1);
  const userBad = await fetchUser(9999);
  console.log("Default:", userBad);
}

testUsers();
