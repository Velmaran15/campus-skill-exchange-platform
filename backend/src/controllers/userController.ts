import { Request, Response } from "express";
import User from "../models/User";
import Skill from "../models/Skill";
import Session from "../models/Session";
import mongoose from "mongoose";

export const getTutorProfile = async (req: Request, res: Response) => {
  try {
    const tutorId = req.params.id;

    // 1️⃣ Get tutor basic info
    const tutor = await User.findById(tutorId).select("-password");

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // 2️⃣ Get tutor skills
    const skills = await Skill.find({ tutor: tutorId });

    // 3️⃣ Get reviews (completed sessions with rating)
    const reviews = await Session.find({
      tutor: tutorId,
      status: "completed",
      rating: { $exists: true, $ne: null }
    })
      .populate("learner", "name profileImage")
      .populate("skill", "skillName")
      .sort({ updatedAt: -1 });

    res.json({
      _id: tutor._id,
      name: tutor.name,
      email: tutor.email,
      profileImage: tutor.profileImage,
      bio: tutor.bio,
      role: tutor.role,
      averageRating: tutor.rating,
      totalSessions: tutor.totalSessions,
      skills,
      reviews
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tutor profile" });
  }
};


export const getTopTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await User.find({ role: "tutor" })
      .sort({ rating: -1, totalSessions: -1 })
      .limit(10)
      .select("name email profileImage rating totalSessions");

    const formattedTutors = tutors.map((tutor) => ({
      _id: tutor._id,
      name: tutor.name,
      email: tutor.email,
      profileImage: tutor.profileImage,
      averageRating: tutor.rating,
      totalSessions: tutor.totalSessions,
    }));

    res.json(formattedTutors);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch top tutors"
    });
  }
};


export const updateBio = async (req: any, res: Response) => {
  try {
    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update bio"
    });
  }
};


export const uploadProfileImage = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file uploaded"
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { profileImage: req.file.filename },
      {
        new: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    console.log("Uploaded file:", req.file);
    res.json({
      message: "Profile image updated successfully",
      user
    });

  } catch (error) {
    console.error("Profile image upload error:", error);

    res.status(500).json({
      message: "Upload failed"
    });
  }
};


export const saveSkill = async (req: any, res: any) => {
  try {
    const { skillId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already saved
    const alreadySaved = user.savedSkills.some(
      (id) => id.toString() === skillId
    );

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Skill already saved",
      });
    }

    user.savedSkills.push(skillId);

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: true,
      message: "Skill saved successfully",
      savedSkills: user.savedSkills,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const unSaveSkill = async (req: any, res: any) => {
  try {
    const { skillId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.savedSkills = user.savedSkills.filter(
      (id) => id.toString() !== skillId
    ) as mongoose.Types.ObjectId[];

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: false,
      message: "Skill removed from saved list",
      savedSkills: user.savedSkills,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getSavedSkills = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "savedSkills",
        populate: {
          path: "tutor",
          select: "name profileImage rating role"
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      savedSkills: user.savedSkills
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};