import { Router } from 'express';
import usersRoute from './users.route.js';
import authRoute from './auth.route.js';

const router = Router();

router.use('/users', usersRoute);
router.use('/auth', authRoute);

export default router;
