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

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/admin', isLoggedIn, isAdmin, adminRoute);
router.use('/song', songRoute);
// router.use('/album', isLoggedIn, albumRoute);
router.use('/album', albumRoute);
router.use('/stats', statsRoute);

export default router;
