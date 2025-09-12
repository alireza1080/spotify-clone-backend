import { Router } from 'express';
import { createSong, deleteSong } from 'controllers/admin.controller.js';

const router = Router();

router.post('/song', createSong).delete('/song/:songId', deleteSong);

export default router;
