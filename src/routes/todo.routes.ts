import { Router } from 'express';
import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo
} from '../controllers/todo.controllers';

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.patch('/:id', toggleTodo);
router.delete('/:id', deleteTodo);

export default router;
