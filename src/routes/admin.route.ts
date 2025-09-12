import { Router } from 'express';
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
} from 'controllers/admin.controller.js';

const router = Router();

// Songs routes
router.post('/songs', createSong);

router.delete('/songs/:songId', deleteSong);

// Albums routes
router.post('/albums', createAlbum);

router.delete('/albums/:albumId', deleteAlbum);

export default router;
