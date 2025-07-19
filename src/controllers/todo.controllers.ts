import { Request, Response } from 'express';
import prisma from '../Prisma';
import logger from '../logger';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const getTodos = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });

  try {
    const todos = await prisma.todo.findMany({ where: { userId } });
    res.status(200).json({ success: true, message: 'Todos fetched successfully', data: todos });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch todos', data: { error: e.message } });
  }
};

export const createTodo = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.user?.id;

  if (!title) return res.status(400).json({ success: false, message: 'Title is required', data: null });
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });

  try {
    const todo = await prisma.todo.create({
      data: { title, user: { connect: { id: userId } } },
    });
    res.status(201).json({ success: true, message: 'Todo created successfully', data: todo });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to create todo', data: { error: e.message } });
  }
};

export const toggleTodo = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });

  try {
    const existingTodo = await prisma.todo.findUnique({ where: { id } });
    if (!existingTodo) return res.status(404).json({ success: false, message: 'Todo not found', data: null });
    if (existingTodo.userId !== userId) return res.status(403).json({ success: false, message: 'Access denied', data: null });

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: !existingTodo.completed },
    });
    res.status(200).json({ success: true, message: 'Todo status updated', data: updatedTodo });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to update todo', data: { error: e.message } });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });

  try {
    const existingTodo = await prisma.todo.findUnique({ where: { id } });
    if (!existingTodo) return res.status(404).json({ success: false, message: 'Todo not found', data: null });
    if (existingTodo.userId !== userId) return res.status(403).json({ success: false, message: 'Access denied', data: null });

    await prisma.todo.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Todo deleted successfully', data: null });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to delete todo', data: { error: e.message } });
  }
};

export const deleteAllTodos = async (req: AuthRequest, res: Response) => {

  console.log('🔥 deleteAllTodos invoked for userId =', req.user?.id);

  const userId = req.user?.id;
  logger.info('→ deleteAllTodos called, user:', userId)

  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized', data: null });

  try {
    const result = await prisma.todo.deleteMany({
      where: { userId }
    });
    if (result.count == 0)
      res.status(404).json({ success: false, message: 'No todos found to delete', data: null });
    else
    res.status(200).json({ success: true, message: 'All todos deleted', data: result.count });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: 'Failed to delete todos', data: { error: errorMessage } });

  }
};
