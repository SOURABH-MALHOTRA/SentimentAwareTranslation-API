const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const app = express();
const bodyParser = require("body-parser");
const router = require("./Routes/router.js");
const userHistoryRoutes = require("./Websocket/userHistory.js");
const { setupWebSocket } = require("./Websocket/websocket.js");
// MIDDLEWARE STARTED
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: { error: "Too many requests, please try again later." },
});

const SECRET_KEY = "token@123";
// MOCK DATABASE
const users = [
  { id: 1, username: "john_doe", password: "password123" },
  { id: 2, username: "jane_doe", password: "securepassword" },
];
const mockAuthMiddleware = (req, res, next) => {
  console.log("Processing Authorization Header...");

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Unauthorized access attempted!");
    return res
      .status(401)
      .json({ error: "Unauthorized: Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Simulating token verification
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token:", decoded);

    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};
app.use(apiLimiter); // APPLIED TO ALL ROUTES
// MIDDLEWARE ENDED
// API
app.use("/", router);
app.use("/api", userHistoryRoutes);
app.get("/rate-limit-test", apiLimiter, (req, res) => {
  res.json({ message: "Rate limiting test passed!" });
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find user with matching credentials (mock logic)
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate a mock token (simulating a real login)
  const payload = { userId: user.id, username: user.username };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token });
});
app.get("/authentication", mockAuthMiddleware, (req, res) => {
  res.json({ message: "Welcome to the protected route", user: req.user });
});
// DATABASE CONNECTION
const { connectToMongoDB } = require("./connection/connection.js");
connectToMongoDB("mongodb://127.0.0.1:27017/Translation").then(() =>
  console.log("Mongodb connected")
);
//PORT
const server = app.listen(2000, () =>
  console.log("Server running on port 2000")
);
setupWebSocket(server); // Pass the server instance to WebSocket
