/**
 * Quick integration test helper
 * 
 * Run from browser console at http://localhost:3000 to verify:
 * 1. Proxy route is working
 * 2. Login flow works
 * 3. Cookies are set correctly
 */

// Test 1: Health check via proxy
async function testHealth() {
    console.log("Testing /api/v1/health...");
    const res = await fetch("/api/v1/health", { credentials: "include" });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
    return res.ok;
}

// Test 2: Login via proxy
async function testLogin(email: string, password: string) {
    console.log("Testing /api/v1/auth/login...");
    const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
    return res.ok;
}

// Test 3: Get current user via proxy
async function testMe() {
    console.log("Testing /api/v1/auth/me...");
    const res = await fetch("/api/v1/auth/me", { credentials: "include" });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
    return res.ok;
}

// Export for use
export { testHealth, testLogin, testMe };
