import express from 'express';
import {
  createTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
  deleteAllTodos,
  editTodo,
} from '../controllers/todo.controllers';

import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/todos',authenticateToken,  getTodos);
router.post('/todos',authenticateToken, createTodo);
router.patch('/todos/:id',authenticateToken,editTodo);
router.patch('/todos/:id/completed',authenticateToken, toggleTodo);
router.delete('/todos/deletealltodos',authenticateToken,deleteAllTodos);
router.delete('/todos/:id',authenticateToken, deleteTodo);


export default router;
