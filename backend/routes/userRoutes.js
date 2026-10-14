
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================================
// REGISTER USER
// ==========================================
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (err) {
    console.error("Registration error:", err.message);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      message: "Registration failed"
    });
  }
});

// ==========================================
// LOGIN USER — TEMPORARY DEBUGGING ENABLED
// ==========================================
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing or invalid input
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n========== LOGIN DEBUG ==========");
    console.log("Login request received");
    console.log("Email received:", email);
    console.log("Password provided:", Boolean(password));

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      console.log("RESULT: Missing or invalid input");
      console.log("=================================\n");

      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    console.log("User found:", Boolean(user));

    if (!user) {
      console.log("RESULT: Email not found in database");
      console.log("=================================\n");

      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    console.log(
      "Stored password appears hashed:",
      typeof user.password === "string" &&
      user.password.startsWith("$2")
    );

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password matches:", isMatch);

    if (!isMatch) {
      console.log("RESULT: Password comparison failed");
      console.log("=================================\n");

      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log("RESULT: Login successful");
    console.log("=================================\n");

    return res.status(200).json({
      message: "Login successful",
      user: safeUser
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Login failed due to a server error"
    });
  }
});

// ==========================================
// GET ALL USERS
// ==========================================
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err.message);

    return res.status(500).json({
      message: "Failed to fetch users"
    });
  }
});

// ==========================================
// UPDATE USER
// ==========================================
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Name must be a non-empty string"
        });
      }

      updates.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          message: "Email must be a non-empty string"
        });
      }

      updates.email = email.trim().toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      updatedUser
    });
  } catch (err) {
    console.error("Update user error:", err.message);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    return res.status(500).json({
      message: "Failed to update user"
    });
  }
});

// ==========================================
// DELETE USER
// ==========================================
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(
      req.params.id
    );

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Delete user error:", err.message);

    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    return res.status(500).json({
      message: "Failed to delete user"
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;
