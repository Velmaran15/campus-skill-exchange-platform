import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";


import jwt from "jsonwebtoken";
/*
  🔐 Register User
*/
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // ✅ GENERATE TOKEN
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bio: newUser.bio,
        profileImage: newUser.profileImage,
        averageRating: newUser.rating,
        totalSessions: newUser.totalSessions
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// 


// Shared sanitized public user shape (C2: never expose password hash).
const toPublicUser = (user: any) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  profileImage: user.profileImage,
  averageRating: user.rating,
  totalSessions: user.totalSessions
});

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: toPublicUser(user)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
  ✏️ Update own profile (name / email) and/or change password.
  Single PUT /auth/profile endpoint preserves the existing frontend contract:
  - { name } / { email } -> profile update
  - { currentPassword, newPassword } -> password change (both in one call allowed)
*/
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body ?? {};

    if (
      name === undefined &&
      email === undefined &&
      currentPassword === undefined &&
      newPassword === undefined
    ) {
      return res.status(400).json({ message: "No profile fields provided" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Profile fields: only explicitly approved fields, partial updates preserved.
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Name must be a non-empty string" });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "Email must be a non-empty string" });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: "Email already in use" });
        }

        user.email = normalizedEmail;
      }
    }

    // Password change via the same endpoint (matches ChangePassword.tsx contract).
    if (currentPassword !== undefined || newPassword !== undefined) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
      }

      if (typeof newPassword !== "string" || newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: toPublicUser(user)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

/*
  🗑️ Delete own account.
  Frontend sends DELETE /auth/profile after typing DELETE in the modal.
  Safe policy: deletion is blocked while the user still owns dependent records
  (skills, sessions, conversations, sent/received notifications/messages would
  otherwise orphan the other participant's views). Report the dependency so a
  retention/cascade policy can be decided separately.
*/
export const deleteAccount = async (req: any, res: Response) => {
  try {
    const userId = req.user._id.toString();

    const ownedSkillCount = await (await import("../models/Skill")).default.countDocuments({ tutor: userId });
    const sessionCount = await (await import("../models/Session")).default.countDocuments({
      $or: [{ tutor: userId }, { learner: userId }]
    });
    const conversationCount = await (await import("../models/Conversation")).default.countDocuments({
      $or: [{ tutor: userId }, { learner: userId }]
    });

    if (ownedSkillCount > 0 || sessionCount > 0 || conversationCount > 0) {
      return res.status(409).json({
        message: "Account cannot be deleted while skills, sessions, or conversations still reference it. Remove or transfer them first."
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};