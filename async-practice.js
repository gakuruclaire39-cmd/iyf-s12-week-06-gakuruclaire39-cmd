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
