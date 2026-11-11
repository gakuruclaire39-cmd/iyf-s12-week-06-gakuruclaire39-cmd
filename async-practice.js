// Lesson 11 - Async Practice - ONLY LESSON 11

// 11.1 Sync vs Async
console.log("1 - Start");
console.log("2 - Middle");
console.log("3 - End");

console.log("1 - Start");
setTimeout(() => console.log("2 - This is delayed"), 2000);
console.log("3 - End");

// Predict: A, C, E, B, D
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
setTimeout(() => console.log("D"), 100);
console.log("E");

function fetchData(callback) {
    setTimeout(() => callback({ name: "John", age: 30 }), 1000);
}
fetchData(data => console.log("Data received:", data));

function loadUser(userId, callback) {
    setTimeout(() => {
        callback({ id: userId, name: "User " + userId });
    }, 1500);
}
loadUser(1, user => console.log("Loaded user:", user));

// 11.2 Callback Hell & Promises
function getUserData_CB(userId, callback) {
    setTimeout(() => callback({ id: userId, name: "John" }), 1000);
}
function getUserPosts_CB(userId, callback) {
    setTimeout(() => callback([{ id: 1, title: "Post 1" }]), 1000);
}
function getPostComments_CB(postId, callback) {
    setTimeout(() => callback([{ id: 1, text: "Great post!" }]), 1000);
}

getUserData_CB(1, user => {
    console.log("User:", user);
    getUserPosts_CB(user.id, posts => {
        console.log("Posts:", posts);
        getPostComments_CB(posts[0].id, comments => {
            console.log("Comments:", comments);
        });
    });
});

function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            userId > 0 ? resolve({ id: userId, name: "John" }) : reject("Invalid user ID");
        }, 1000);
    });
}
function getUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            userId > 0 ? resolve([{ id: 1, title: "Post 1", userId }]) : reject("Invalid");
        }, 1000);
    });
}
function getPostComments(postId) {
    return new Promise(resolve => {
        setTimeout(() => resolve([{ id: 1, text: "Great!", postId }]), 1000);
    });
}

// 11.3 Promise Chaining
getUserData(1)
    .then(user => { console.log("User:", user); return getUserPosts(user.id); })
    .then(posts => { console.log("Posts:", posts); return getPostComments(posts[0].id); })
    .then(comments => console.log("Comments:", comments))
    .catch(err => console.error("Error:", err));

Promise.all([getUserData(1), getUserData(2), getUserData(3)])
    .then(results => console.log("All users:", results))
    .catch(err => console.error("One failed:", err));

Promise.race([
    new Promise(r => setTimeout(() => r("Fast!"), 100)),
    new Promise(r => setTimeout(() => r("Slow!"), 500))
]).then(result => console.log("Winner:", result));

// Build: 3 users at once
Promise.all([getUserData(1), getUserData(2), getUserData(3)])
    .then(users => console.log("Build - 3 users at once:", users));

// 11.4 Async/Await
async function getDataWithAsync() {
    const user = await getUserData(1);
    const posts = await getUserPosts(user.id);
    const comments = await getPostComments(posts[0].id);
    return comments;
}
getDataWithAsync().then(c => console.log("Async comments:", c));

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

async function getAllUsers() {
    const [u1, u2, u3] = await Promise.all([getUserData(1), getUserData(2), getUserData(3)]);
    return [u1, u2, u3];
}

// Build: Rewrite callback hell using async/await
async function getFullUserStory(userId) {
    try {
        console.log(`--- Full story for user ${userId} ---`);
        const user = await getUserData(userId);
        console.log("User:", user);
        const posts = await getUserPosts(user.id);
        console.log("Posts:", posts);
        const comments = await getPostComments(posts[0].id);
        console.log("Comments:", comments);
        return { user, posts, comments };
    } catch (error) {
        console.error("Error:", error);
    }
}
getFullUserStory(1);
