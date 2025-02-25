// Import required modules
const express = require("express");
const redis = require("redis");

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "redisdb";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Create a Redis client
const client = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
    await client.connect();
})();

// Define a root route
app.get("/", (req, res) => {
    res.send("Welcome to the Node.js Redis App! Use /count to increment and retrieve the counter.");
});

// Define an API route
app.get("/count", async (req, res) => {
    try {
        let count = await client.get("counter");
        count = count ? parseInt(count) + 1 : 1;
        await client.set("counter", count);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: "Redis error", details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
