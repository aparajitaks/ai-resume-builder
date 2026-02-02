import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const users = []; // TEMP (replace with DB later)

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ email, password });

  res.json({ message: "User registered" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, "SECRET_KEY", {
    expiresIn: "1d",
  });

  res.json({ token });
});

export default router;
