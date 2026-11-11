// ===== TASK 11.1: Understanding Async =====

console.log("--- Exercise 1: Sync vs Async ---");

// Synchronous - blocks until complete
console.log("1 - Start");
console.log("2 - Middle");
console.log("3 - End");
// Output: 1, 2, 3 (in order)

// Asynchronous - doesn't block
console.log("1 - Start");
setTimeout(() => {
    console.log("2 - This is delayed");
}, 2000);
console.log("3 - End");
// Output: 1, 3, then 2 (after 2 seconds)

// Predict the output:
console.log("--- Predict output ---");
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
setTimeout(() => console.log("D"), 100);
console.log("E");

// ANSWER: A C E B D
// Why? JS is single-threaded with Event Loop.
// 1. A logged immediately
// 2. setTimeout B with 0ms goes to Web API -> Callback Queue, not executed yet
// 3. C logged immediately
// 4. setTimeout D 100ms -> Web API
// 5. E logged immediately
// 6. Call stack empty -> Event Loop checks queue -> B (0ms done) -> log B
// 7. After 100ms -> D -> log D

console.log("--- Exercise 2: Callback Pattern ---");

// Old-style callbacks
function fetchData(callback) {
    setTimeout(() => {
        const data = { name: "John", age: 30 };
        callback(data);
    }, 1000);
}

fetchData(function(data) {
    console.log("Data received:", data);
});

// Build: Create a function that simulates loading user data
function loadUser(userId, callback) {
    console.log(`Loading user ${userId}...`);
    // Simulate 1.5 second database lookup
    setTimeout(() => {
        const user = {
            id: userId,
            name: "Claire Wairimu",
            email: "gakuruclaire@gmail.com",
            role: "Student"
        };
        // Call callback with user object
        callback(user);
    }, 1500);
}

// Use it
loadUser(39, function(user) {
    console.log("User loaded:", user);
});

loadUser(1, (user) => {
    console.log("Arrow callback - User:", user.name);
});

// ===== TASK 11.2: Callback Hell & Promises =====

// Exercise 1: Experience Callback Hell
// This is BAD - "Callback Hell" or "Pyramid of Doom"
function getUserDataCB(userId, callback) {
    setTimeout(() => {
        callback({ id: userId, name: "John" });
    }, 1000);
}

function getUserPostsCB(userId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" }
        ]);
    }, 1000);
}

function getPostCommentsCB(postId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, text: "Great post!" },
            { id: 2, text: "Thanks for sharing" }
        ]);
    }, 1000);
}

// The nightmare:
getUserDataCB(1, function(user) {
    console.log("User:", user);
    getUserPostsCB(user.id, function(posts) {
        console.log("Posts:", posts);
        getPostCommentsCB(posts[0].id, function(comments) {
            console.log("Comments:", comments);
        });
    });
});

// Exercise 2: Promises to the Rescue
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
    const success = true;
    setTimeout(() => {
        if (success) {
            resolve("It worked!");
        } else {
            reject("Something went wrong");
        }
    }, 1000);
});

// Using a Promise
myPromise
    .then(result => {
        console.log("Success:", result);
    })
    .catch(error => {
        console.log("Error:", error);
    });

// Refactored to return Promises
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "John" });
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

function getUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve([
                    { id: 1, title: "Post 1" },
                    { id: 2, title: "Post 2" }
                ]);
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

function getPostComments(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (postId > 0) {
                resolve([
                    { id: 1, text: "Great post!" },
                    { id: 2, text: "Thanks for sharing" }
                ]);
            } else {
                reject("Invalid post ID");
            }
        }, 1000);
    });
}

// Test Promises version - clean!
getUserData(1)
    .then(user => {
        console.log("Promise User:", user);
        return getUserPosts(user.id);
    })
    .then(posts => {
        console.log("Promise Posts:", posts);
        return getPostComments(posts[0].id);
    })
    .then(comments => {
        console.log("Promise Comments:", comments);
    })
    .catch(err => {
        console.log("Promise Error:", err);
    });

// ===== TASK 11.3: Promise Chaining =====

console.log("--- TASK 11.3 Exercise 1: Chain Promises ---");

// After refactoring to Promises:
getUserData(1)
    .then(user => {
        console.log("User:", user);
        return getUserPosts(user.id);
    })
    .then(posts => {
        console.log("Posts:", posts);
        return getPostComments(posts[0].id);
    })
    .then(comments => {
        console.log("Comments:", comments);
    })
    .catch(error => {
        console.error("Error:", error);
    });

console.log("--- TASK 11.3 Exercise 2: Promise.all ---");

// Run multiple promises in parallel
const promise1 = getUserData(1);
const promise2 = getUserData(2);
const promise3 = getUserData(3);

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log("All users:", results);
        // results is an array [user1, user2, user3]
    })
    .catch(error => {
        // If ANY promise fails, this runs
        console.error("One failed:", error);
    });

console.log("--- TASK 11.3 Exercise 3: Promise.race ---");

// First to complete wins
const fast = new Promise(resolve => setTimeout(() => resolve("Fast!"), 100));
const slow = new Promise(resolve => setTimeout(() => resolve("Slow!"), 500));

Promise.race([fast, slow])
    .then(result => {
        console.log("Winner:", result);  // "Fast!"
    });

// ===== BUILD TASK: Fetch data for 3 users simultaneously and display them all at once =====

function buildUsersDisplay(users) {
    console.log("=== BUILD: Displaying 3 users at once ===");
    users.forEach(user => {
        console.log(`User ${user.id}: ${user.name}`);
    });
    
    // If you have HTML:
    const container = document.getElementById('users-container');
    if (container) {
        container.innerHTML = users.map(user => `
            <div class="user-card">
                <h3>User ${user.id}</h3>
                <p>Name: ${user.name}</p>
            </div>
        `).join('');
    }
}

// Fetch 3 users simultaneously and display them all at once
Promise.all([
    getUserData(1),
    getUserData(2),
    getUserData(3)
])
.then(allUsers => {
    console.log("BUILD - All 3 users fetched:", allUsers);
    buildUsersDisplay(allUsers);
    return Promise.all([
        getUserPosts(allUsers[0].id),
        getUserPosts(allUsers[1].id),
        getUserPosts(allUsers[2].id)
    ]);
})
.then(allPosts => {
    console.log("BUILD - All posts for 3 users:", allPosts);
})
.catch(error => {
    console.error("BUILD Error:", error);
});

// BONUS: Promise.allSettled - shows success + failures
Promise.allSettled([
    getUserData(1),
    getUserData(-1), // will fail
    getUserData(3)
]).then(results => {
    console.log("allSettled results:", results);
    results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
            console.log(`User ${i+1} success:`, r.value);
        } else {
            console.log(`User ${i+1} failed:`, r.reason);
        }
    });
});

// ===== TASK 11.4: Async/Await =====
console.log("--- TASK 11.4 STARTS IN 10s ---");

setTimeout(async () => {
console.log("=== TASK 11.4: Async/Await ===");

// Exercise 1: Converting to Async/Await

// Promise chain version:
function getDataWithPromises() {
    return getUserData(1)
        .then(user => getUserPosts(user.id))
        .then(posts => getPostComments(posts[0].id))
        .then(comments => comments);
}

// Async/await version (much cleaner!):
async function getDataWithAsync() {
    const user = await getUserData(1);
    const posts = await getUserPosts(user.id);
    const comments = await getPostComments(posts[0].id);
    return comments;
}

console.log("Ex 1: Promise chain version");
getDataWithPromises().then(c => console.log("Promises result:", c));

console.log("Ex 1: Async/Await version");
const comments1 = await getDataWithAsync();
console.log("Async/Await result:", comments1);

// Exercise 2: Error Handling with Try/Catch
async function fetchUserData(userId) {
    try {
        const user = await getUserData(userId);
        const posts = await getUserPosts(user.id);
        return { user, posts };
    } catch (error) {
        console.error("Failed to fetch:", error);
        throw error;
    }
}

console.log("Ex 2: Try/Catch - success case");
const data = await fetchUserData(1);
console.log("Fetched:", data);

console.log("Ex 2: Try/Catch - fail case");
try {
    await fetchUserData(-1);
} catch(e) {
    console.log("Caught error as expected:", e);
}

// Exercise 3: Parallel with Async/Await
async function getAllUsers() {
    console.log("Sequential (slow) - 3 sec");
    let start = Date.now();
    const user1 = await getUserData(1);
    const user2 = await getUserData(2);
    const user3 = await getUserData(3);
    console.log(`Sequential done in ${Date.now()-start}ms:`, [user1,user2,user3]);

    console.log("Parallel (fast) - 1 sec");
    start = Date.now();
    const [u1, u2, u3] = await Promise.all([
        getUserData(1),
        getUserData(2),
        getUserData(3)
    ]);
    console.log(`Parallel done in ${Date.now()-start}ms:`, [u1,u2,u3]);
    
    return [u1, u2, u3];
}

await getAllUsers();

// BUILD: Rewrite callback hell using async/await
console.log("=== BUILD: Callback Hell -> Async/Await ===");

async function buildRewrite() {
    try {
        // OLD callback hell was 3 nested callbacks
        // NEW async/await - flat and clean
        const user = await getUserData(1);
        console.log("BUILD User:", user);
        
        const posts = await getUserPosts(user.id);
        console.log("BUILD Posts:", posts);
        
        const comments = await getPostComments(posts[0].id);
        console.log("BUILD Comments:", comments);
        
        console.log("✔ BUILD COMPLETE - Same result, no hell!");
        return { user, posts, comments };
    } catch (error) {
        console.error("BUILD Error:", error);
    }
}

await buildRewrite();

}, 10000);

// ===== TASK 12.1: Fetch API Basics =====

// Exercise 1: Your First Fetch
fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(response => {
        console.log("Response object:", response);
        console.log("Status:", response.status);
        console.log("OK:", response.ok);
        return response.json();
    })
    .then(data => {
        console.log("User data:", data);
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

// Exercise 2: Fetch with Async/Await
async function getUser(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}

async function main121() {
    const user = await getUser(1);
    console.log("12.1 user:", user);
    
    // Practice: All users
    const allRes = await fetch("https://jsonplaceholder.typicode.com/users");
    const allUsers = await allRes.json();
    console.log("All users:", allUsers);
    
    // Posts for user 1
    const postsRes = await fetch("https://jsonplaceholder.typicode.com/users/1/posts");
    const posts = await postsRes.json();
    console.log("Posts for user 1:", posts);
}
main121();

// ===== TASK 12.2: Display API Data in DOM =====
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");

function showLoading() {
    loading.classList.remove("hidden");
    container.innerHTML = "";
}
function hideLoading() {
    loading.classList.add("hidden");
}
function showError(message) {
    errorDiv.textContent = `Error: ${message}`;
    errorDiv.classList.remove("hidden");
}
function displayUsers(users) {
    container.innerHTML = users.map(user => `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        </div>
    `).join("");
}

async function loadUsers() {
    try {
        showLoading();
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}
loadUsers();

// ===== TASK 12.3: POST Requests =====
async function createPost(title, body, userId) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId })
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
}

async function demoPost() {
    const newPost = await createPost("My First Post", "This is the content.", 1);
    console.log("Created:", newPost);
}
demoPost();

// Form handler (Build)
const postForm = document.getElementById("postForm");
if (postForm) {
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("postTitle").value;
        const body = document.getElementById("postBody").value;
        const userId = document.getElementById("postUserId").value;
        const result = await createPost(title, body, userId);
        document.getElementById("postResult").innerHTML = JSON.stringify(result, null, 2);
    });
}

// ===== TASK 12.4: Search & Filter =====
let allUsers = [];
let filteredUsers = [];

async function init124() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    allUsers = await res.json();
    filteredUsers = [...allUsers];
    
    // Populate city filter
    const cityFilter = document.getElementById("cityFilter");
    if (cityFilter) {
        const cities = [...new Set(allUsers.map(u => u.address.city))];
        cities.forEach(city => {
            const opt = document.createElement("option");
            opt.value = city;
            opt.textContent = city;
            cityFilter.appendChild(opt);
        });
    }
    
    displayUsers(allUsers);

    // Search
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            applyFilters();
        });
    }
    // Sort
    const sortSelect = document.getElementById("sort");
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);
    // City filter
    if (cityFilter) cityFilter.addEventListener("change", applyFilters);
}

function applyFilters() {
    let result = [...allUsers];
    const query = document.getElementById("search")?.value.toLowerCase() || "";
    const city = document.getElementById("cityFilter")?.value || "";
    const sort = document.getElementById("sort")?.value || "";

    if (query) {
        result = result.filter(user => 
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }
    if (city) {
        result = result.filter(user => user.address.city === city);
    }
    if (sort === "az") result.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === "za") result.sort((a,b) => b.name.localeCompare(a.name));

    displayUsers(result);
}

init124();
