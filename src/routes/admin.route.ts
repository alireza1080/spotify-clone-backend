import { Router } from 'express';

const router = Router();

router.post('/createSong', (req, res) => {
  res.send('Hello Admin');
});

export default router;
