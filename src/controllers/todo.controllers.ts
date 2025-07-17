import { Request, Response } from 'express';
import prisma from '../Prisma';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const getTodos = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const todos = await prisma.todo.findMany({
    where: { userId }, 
  });
  res.json(todos);
};

export const createTodo = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.user?.id;

  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const todo = await prisma.todo.create({
    data: {
      title,
      user: { connect: { id: userId } }, // Use actual logged-in user ID
    },
  });

  res.status(201).json(todo);
};

export const toggleTodo = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;

  const existingTodo = await prisma.todo.findUnique({ where: { id } });

  if (!existingTodo) return res.status(404).json({ error: 'Todo not found' });
  if (existingTodo.userId !== userId)
    return res.status(403).json({ error: 'Access denied' });

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { completed: !existingTodo.completed },
  });

  res.json(updatedTodo);
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;

  const existingTodo = await prisma.todo.findUnique({ where: { id } });
  if (!existingTodo) return res.status(404).json({ error: 'Todo not found' });
  if (existingTodo.userId !== userId)
    return res.status(403).json({ error: 'Access denied' });

  await prisma.todo.delete({ where: { id } });
  res.status(204).send();
};
