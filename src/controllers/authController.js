const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const CustomError = require("../utils/customError");

const registerSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.email": "email is invalid",
    "any.required": "email is required",
  }),
  password: Joi.string().required().min(6).trim(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).strip(),
});

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

exports.register = async (req, res, next) => {
  try {
    // 1. validate input (req.body)
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      throw error;
      // return next(err);
    }

    //2. insert data to users
    value.password = await bcrypt.hash(value.password, 12);
    await User.create(value);

    //3. sent response
    res.status(201).json({ message: "Register success" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    //1. validate
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(err);
    }

    //2. search
    const result = await User.findOne({
      where: { email: value.email },
    });
    if (!result) {
      return next(new CustomError("Invalid email or password", 400));
    }

    //3. compare password
    const isMatch = await bcrypt.compare(value.password, result.password);
    if (!isMatch) {
      return next(new CustomError("Invalid email or password", 400));
    }

    //4. jwt
    const payload = { id: result.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 1000 * 60 * 60 * 24 * 7,
    });

    //5. sent response
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
