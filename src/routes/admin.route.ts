import { Router } from 'express';
import { createSong } from 'controllers/admin.controller.js';

const router = Router();

router.post('/song', createSong);

export default router;
