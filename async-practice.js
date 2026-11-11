// ===== HELPER: Safe display =====
function safeDisplayUsers(users) {
    const container = document.getElementById("users-container");
    if (!container) {
        console.log("DisplayUsers (no DOM):", users);
        return;
    }
    container.innerHTML = users.map(user => `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        </div>
    `).join("");
}

function safeGet(id) { return document.getElementById(id); }

// ===== TASK 11.2 =====
function getUserDataCB(userId, callback) {
    setTimeout(() => { callback({ id: userId, name: "John" }); }, 1000);
}
function getUserPostsCB(userId, callback) {
    setTimeout(() => { callback([{ id: 1, title: "Post 1" },{ id: 2, title: "Post 2" }]); }, 1000);
}
function getPostCommentsCB(postId, callback) {
    setTimeout(() => { callback([{ id: 1, text: "Great post!" }]); }, 1000);
}
getUserDataCB(1, function(user) {
    console.log("CB User:", user);
    getUserPostsCB(user.id, function(posts) {
        console.log("CB Posts:", posts);
        getPostCommentsCB(posts[0].id, function(comments) {
            console.log("CB Comments:", comments);
        });
    });
});

function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) resolve({ id: userId, name: "John" });
            else reject("Invalid user ID");
        }, 500);
    });
}
function getUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) resolve([{ id: 1, title: "Post 1" },{ id: 2, title: "Post 2" }]);
            else reject("Invalid user ID");
        }, 500);
    });
}
function getPostComments(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (postId > 0) resolve([{ id: 1, text: "Great post!" }]);
            else reject("Invalid post ID");
        }, 500);
    });
}

// ===== TASK 11.3 =====
getUserData(1)
    .then(user => { console.log("Chain User:", user); return getUserPosts(user.id); })
    .then(posts => { console.log("Chain Posts:", posts); return getPostComments(posts[0].id); })
    .then(comments => { console.log("Chain Comments:", comments); })
    .catch(e => console.error(e));

Promise.all([getUserData(1), getUserData(2), getUserData(3)])
    .then(r => { console.log("All users:", r); safeDisplayUsers(r); })
    .catch(e => console.error("One failed:", e));

Promise.race([new Promise(res=>setTimeout(()=>res("Fast!"),100)), new Promise(res=>setTimeout(()=>res("Slow!"),500))])
    .then(r=>console.log("Winner:", r));

// ===== TASK 11.4 =====
async function getDataWithAsync() {
    const user = await getUserData(1);
    const posts = await getUserPosts(user.id);
    const comments = await getPostComments(posts[0].id);
    return comments;
}
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
    const [u1,u2,u3] = await Promise.all([getUserData(1),getUserData(2),getUserData(3)]);
    return [u1,u2,u3];
}
async function run11_4() {
    console.log("11.4 async result:", await getDataWithAsync());
    console.log("11.4 fetchUserData:", await fetchUserData(1));
    console.log("11.4 getAllUsers:", await getAllUsers());
}
setTimeout(run11_4, 3000);

// ===== TASK 12.1 =====
fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(r => { console.log("Status:", r.status); return r.json(); })
    .then(data => console.log("Fetch user:", data))
    .catch(e=>console.error(e));

async function getUser(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) { console.error("Failed to fetch user:", error); }
}
async function main121() {
    const user = await getUser(1);
    console.log("12.1 getUser:", user);
    const all = await (await fetch("https://jsonplaceholder.typicode.com/users")).json();
    console.log("12.1 all users count:", all.length);
    const posts = await (await fetch("https://jsonplaceholder.typicode.com/users/1/posts")).json();
    console.log("12.1 posts for user1:", posts.length);
}
main121();

// ===== TASK 12.2 + 12.4 =====
let allUsers = [];

async function loadUsers() {
    const loading = safeGet("loading");
    const errorDiv = safeGet("error");
    try {
        if(loading) loading.classList.remove("hidden");
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        allUsers = await response.json();
        
        // city dropdown
        const cityFilter = safeGet("cityFilter");
        if (cityFilter) {
            const cities = [...new Set(allUsers.map(u=>u.address.city))];
            cityFilter.innerHTML = '<option value="">All Cities</option>';
            cities.forEach(c=>{
                const opt=document.createElement("option");
                opt.value=c; opt.textContent=c;
                cityFilter.appendChild(opt);
            });
        }
        safeDisplayUsers(allUsers);
    } catch (error) {
        if (errorDiv) { errorDiv.textContent = `Error: ${error.message}`; errorDiv.classList.remove("hidden"); }
        console.error(error);
    } finally {
        if(loading) loading.classList.add("hidden");
    }
}

function applyFilters() {
    let result = [...allUsers];
    const query = safeGet("search")?.value.toLowerCase() || "";
    const city = safeGet("cityFilter")?.value || "";
    const sort = safeGet("sort")?.value || "";
    if (query) result = result.filter(u=> u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
    if (city) result = result.filter(u=> u.address.city === city);
    if (sort==="az") result.sort((a,b)=>a.name.localeCompare(b.name));
    if (sort==="za") result.sort((a,b)=>b.name.localeCompare(a.name));
    safeDisplayUsers(result);
}

// Attach listeners only if elements exist
document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    const s = safeGet("search"); if(s) s.addEventListener("input", applyFilters);
    const so = safeGet("sort"); if(so) so.addEventListener("change", applyFilters);
    const cf = safeGet("cityFilter"); if(cf) cf.addEventListener("change", applyFilters);
});

// ===== TASK 12.3 =====
async function createPost(title, body, userId) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId })
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
}
const postForm = safeGet("postForm");
if (postForm) {
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = safeGet("postTitle")?.value;
        const body = safeGet("postBody")?.value;
        const userId = safeGet("postUserId")?.value;
        const result = await createPost(title, body, userId);
        const div = safeGet("postResult");
        if(div) { div.classList.remove("hidden"); div.textContent = JSON.stringify(result,null,2); }
        console.log("Created:", result);
    });
}
