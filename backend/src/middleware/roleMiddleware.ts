import { Request, Response, NextFunction } from "express";

export const isTutor = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "tutor") {
    next();
  } else {
    res.status(403).json({ message: "Only tutors can add skills" });
  }
};

export const isLearner = (req: any, res: Response, next: NextFunction) => {
  if(req.user && req.user.role === "learner"){
    next();
  }
  else{
    res.status(403).json({ message: "Only learner can save skills" });
  }
}