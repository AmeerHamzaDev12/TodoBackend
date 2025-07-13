"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.toggleTodo = exports.createTodo = exports.getTodos = void 0;
const Prisma_1 = __importDefault(require("../Prisma"));
const getTodos = async (_, res) => {
    const todos = await Prisma_1.default.todo.findMany();
    res.json(todos);
};
exports.getTodos = getTodos;
const createTodo = async (req, res) => {
    const { title, userId } = req.body;
    const todo = await Prisma_1.default.todo.create({
        data: {
            title,
            user: { connect: { id: userId } }
        }
    });
    res.status(201).json(todo);
};
exports.createTodo = createTodo;
const toggleTodo = async (req, res) => {
    const id = parseInt(req.params.id);
    const todo = await Prisma_1.default.todo.update({
        where: { id },
        data: { completed: true }
    });
    res.json(todo);
};
exports.toggleTodo = toggleTodo;
const deleteTodo = async (req, res) => {
    const id = parseInt(req.params.id);
    await Prisma_1.default.todo.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteTodo = deleteTodo;
