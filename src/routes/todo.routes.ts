import express from 'express';
import {
  createTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
} from '../controllers/todo.controllers';

import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/todos',authenticateToken,  getTodos);
router.post('/todos',authenticateToken, createTodo);
router.patch('/todos/:id',authenticateToken, toggleTodo);
router.delete('/todos/:id',authenticateToken, deleteTodo);


export default router;
