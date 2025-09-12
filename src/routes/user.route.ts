import { Router } from 'express';
import { isLoggedIn } from 'middlewares/isLoggedIn.middleware.js';
import { getAllUsers } from 'controllers/user.controller.js';

const router = Router();

router.get('/', isLoggedIn, getAllUsers);

export default router;
