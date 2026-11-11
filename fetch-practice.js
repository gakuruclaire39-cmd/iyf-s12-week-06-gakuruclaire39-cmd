// ============== Task 12.1: Fetch API Basics ==============

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

async function main12_1() {
    const user = await getUser(1);
    console.log("Async user:", user);
    
    // Practice: All users
    const allUsersRes = await fetch("https://jsonplaceholder.typicode.com/users");
    const allUsers = await allUsersRes.json();
    console.log("All users:", allUsers);
    
    // Practice: Posts for user 1
    const postsRes = await fetch("https://jsonplaceholder.typicode.com/users/1/posts");
    const posts = await postsRes.json();
    console.log("Posts for user 1:", posts);
}
main12_1();

// ============== Task 12.2: Display API Data in DOM ==============

// HTML needed:
// <div id="app"><h1>User Directory</h1><div id="loading">Loading...</div><div id="error" class="hidden"></div><div id="users-container"></div></div>

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");

async function loadUsers() {
    try {
        if(loading) showLoading();
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        if(container) displayUsers(users);
    } catch (error) {
        if(errorDiv) showError(error.message);
    } finally {
        if(loading) hideLoading();
    }
}
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
// Uncomment to run
// loadUsers();

// ============== Task 12.3: POST Requests ==============
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
    const newPost = await createPost("My First Post", "This is content", 1);
    console.log("Created:", newPost);
}
demoPost();

// ============== Task 12.4: Search & Filter ==============
let allUsers = [];
async function initDirectory() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    allUsers = await res.json();
    if(container) displayUsers(allUsers);
    
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allUsers.filter(user => 
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
            displayUsers(filtered);
        });
    }
    
    // Sort feature
    const sortBtn = document.getElementById("sort");
    if (sortBtn) {
        sortBtn.addEventListener("click", () => {
            const sorted = [...allUsers].sort((a,b) => a.name.localeCompare(b.name));
            displayUsers(sorted);
        });
    }
}
// initDirectory();
