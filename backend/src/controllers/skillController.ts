import { Request, Response } from "express";
import Skill from "../models/Skill";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}
// Add a new skill for the logged-in tutor
export const addSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { skillName, level, description } = req.body;

    const skill = await Skill.create({
      tutor: req.user._id,
      skillName,
      level,
      description
    });

    res.status(201).json({
      message: "Skill created",
      skill
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add skill" });
  }
};


// Enhanced getSkills with filtering and sorting
export const getSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { name, level, minRating, sortBy } = req.query;

    // 1️⃣ Build query
    let query: any = {};

    if (name) {
      query.skillName = { $regex: name, $options: "i" };
    }

    if (level) {
      query.level = level;
    }

    // 2️⃣ Fetch skills + tutor info
    let skillsQuery = Skill.find(query).populate("tutor");

    let skills = await skillsQuery;

    // Get learner's saved skills
    let savedSkillIds: string[] = [];

    if (req.user) {
      const user = await User.findById(req.user._id);

      if (user) {
        savedSkillIds = user.savedSkills.map((id: any) => id.toString());
      }
    }

    // Add averageRating and isSaved to every skill
    skills = skills.map((skill: any) => ({
      ...skill.toObject(),

      tutor: {
        ...skill.tutor.toObject(),
        averageRating: skill.tutor.rating
      },

      isSaved: savedSkillIds.includes(skill._id.toString())
    }));

    // 3️⃣ Filter by tutor rating (after populate)
    if (minRating) {
      skills = skills.filter(
        (s: any) => s.tutor.rating >= Number(minRating)
      );
    }

    // 4️⃣ Sort results
    if (sortBy === "rating") {
      skills.sort((a: any, b: any) => b.tutor.rating - a.tutor.rating);
    }

    res.json(skills);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch skills"
    });
  }
};

// Get skills of the logged-in tutor
export const getMySkills = async (req: AuthRequest, res: Response) => {
  try {
    const skills = await Skill.find({
      tutor: req.user._id
    });

    res.json(skills);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your skills" });
  }
};

// Delete a skill by ID (only if it belongs to the logged-in tutor)
export const deleteSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // 🔐 Ensure only owner can delete
    if (skill.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await skill.deleteOne();

    res.json({ message: "Skill deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete skill" });
  }
};

// Update a skill by ID (only if it belongs to the logged-in tutor)
export const updateSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { skillName, description, level } = req.body;

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found"
      });
    }

    if (skill.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    skill.skillName = skillName;
    skill.description = description;
    skill.level = level;

    await skill.save();

    res.json(skill);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update skill"
    });
  }
};

