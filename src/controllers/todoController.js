const { Todo } = require("../models");
const CustomError = require("../utils/customError");
const Joi = require("joi");

const createTodoSchema = Joi.object({
  title: Joi.string().required().trim(),
  completed: Joi.boolean().default(false),
});

const updateTodoSchema = Joi.object({
    title: Joi.string().trim(),
    completed: Joi.boolean().default(false),
  });

exports.getAlltodo = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await Todo.findAll({
      where: { user_id: user.id },
    });
    if (!result.length) res.json({ message: "Not have list" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const user = req.user;
    const { value, error } = createTodoSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    await Todo.create({
      title,
      completed: completed || 0,
      userId: user.id,
    });

    res.status(200).json({ message: "Create completed" });
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const todo = req.body;
    console.log(id);
    if (Object.keys(todo).length === 0) {
      return next(new CustomError("Cannot update this list", 400));
    }
    const result = await Todo.update(todo, {
      where: {
        id,
      },
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
