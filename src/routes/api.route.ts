import { Router } from 'express';
import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import adminRoute from './admin.route.js';
import songRoute from './song.route.js';
import albumRoute from './album.route.js';
import statsRoute from './stats.route.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/admin', isLoggedIn, isAdmin, adminRoute);
router.use('/songs', songRoute);
router.use('/albums', albumRoute);
router.use('/stats', statsRoute);

export default router;
