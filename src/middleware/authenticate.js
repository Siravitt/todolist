const CustomError = require("../utils/customError");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new CustomError("You are unauthorized", 401));
    }
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      where: { id: payload.id },
    });
    if (!user) {
      return next(new CustomError("You are unauthorized", 401));
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
