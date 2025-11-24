const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",  // Allow Vite frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

const SECRET_KEY = "mysecretkey";

// Dummy database (real me MongoDB use hota h)
const users = [
  {
    email: "test@gmail.com",
    password: bcrypt.hashSync("123456", 10)  // hashed password
  }
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 1. Check email exist?
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.json({ error: "Email not found" });
  }

  // 2. Check password match?
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.json({ error: "Wrong password" });
  }

  // 3. Generate token
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    message: "Login successful",
    token
  });
});

app.listen(3000, () => console.log("Server running on 3000"));
