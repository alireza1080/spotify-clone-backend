import { Router } from 'express';
import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import adminRoute from './admin.route.js';
import songRoute from './song.route.js';
import albumRoute from './album.route.js';

const router = Router();

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/song', songRoute);
router.use('/album', albumRoute);

export default router;
