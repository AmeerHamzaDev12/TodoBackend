import { Request, Response } from 'express';
import prisma from '../Prisma';

export const getTodos = async (_: Request, res: Response) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
};

export const createTodo = async (req: Request, res: Response) => {
  const { title, userId } = req.body;
  const todo = await prisma.todo.create({
    data: {
      title,
      user: { connect: { id: userId } }
    }
  });
  res.status(201).json(todo);
};


export const toggleTodo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todo = await prisma.todo.update({
    where: { id },
    data: { completed: true }
  });
  res.json(todo);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await prisma.todo.delete({ where: { id } });
  res.status(204).send();
};
