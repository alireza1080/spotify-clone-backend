import { Router } from 'express';
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
} from 'controllers/song.controller.js';
import { isAdmin } from 'middlewares/isAdmin.middleware.js';
import { isLoggedIn } from 'middlewares/isLoggedIn.middleware.js';

const router = Router();

router.get('/', isLoggedIn, isAdmin, getAllSongs);

router.get('/featured', getFeaturedSongs);

router.get('/made-for-you', getMadeForYouSongs);

router.get('/trending', getTrendingSongs);

export default router;
