import Resume from "../models/Resume.model.js";

export const createResume = async (req, res, next) => {
  try {
    const resume = await Resume.create({
      userId: req.userId,
      ...req.body
    });
    res.status(201).json(resume);
  } catch (err) {
    next(err);
  }
};
