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
