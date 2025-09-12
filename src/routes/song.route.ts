import { Router } from 'express';
import { getSongs, getSongById } from 'controllers/song.controller.js';

const router = Router();

router.get('/', getSongs);

router.get('/:songId', getSongById);

export default router;
