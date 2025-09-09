import { Router } from 'express';
import { fullNameValidator } from 'validators/fullName.validator.js';
import { songTitleValidator } from 'validators/songTitle.validator.js';

const router = Router();

router.post('/createSong', (req, res, next) => {
  try {
    // Check if song cover image is present
    if (!req.files?.songCoverImage) {
      return res.status(400).json({ message: 'Song cover image is required', success: false });
    }

    // Check if song audio is present
    if (!req.files?.songAudio) {
      return res.status(400).json({ message: 'Song audio is required', success: false });
    }

    const { titleReceived, artistReceived, durationReceived, albumIdReceived } = req.body;
    const { songCoverImage, songAudio } = req.files;

    // Validate song title
    const { success: titleSuccess, title, error: titleError } = songTitleValidator(titleReceived);

    if (!titleSuccess) {
      return res.status(400).json({ message: titleError, success: false });
    }

    // Validate artist
    const { success: artistSuccess, artist, error: artistError } = fullNameValidator(artistReceived);
    if (!artistSuccess) {
      return res.status(400).json({ message: artistError, success: false });
    }

    // Validate duration
    const { success: durationSuccess, duration, error: durationError } = songDurationValidator(durationReceived);
    if (!durationSuccess) {
      return res.status(400).json({ message: durationError, success: false });
    }

    // Validate album id
    const { success: albumIdSuccess, albumId, error: albumIdError } = mongoDbIdValidator(albumIdReceived);
    if (!albumIdSuccess) {
      return res.status(400).json({ message: albumIdError, success: false });
    }

  } catch (error) {
    next({ err: error, field: 'createSong' });
  }
});

export default router;
