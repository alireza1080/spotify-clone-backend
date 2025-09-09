import { Router } from 'express';
import { type UploadedFile } from 'express-fileupload';
import { prisma } from 'services/db.service.js';
import { uploadToCloudinary } from 'utils/uploadToCloudinary.js';
import { fullNameValidator } from 'validators/fullName.validator.js';
import { mongoDbIdValidator } from 'validators/mongoDbId.validator.js';
import { songDurationValidator } from 'validators/songDuration.validator.js';
import { songTitleValidator } from 'validators/songTitle.validator.js';

const router = Router();

router.post('/createSong', async (req, res, next) => {
  try {
    // Check if song cover image is present
    if (!req.files?.songCoverImage) {
      return res
        .status(400)
        .json({ message: 'Song cover image is required', success: false });
    }

    // Check if song audio is present
    if (!req.files?.songAudio) {
      return res
        .status(400)
        .json({ message: 'Song audio is required', success: false });
    }

    const { titleReceived, artistReceived, durationReceived, albumIdReceived } =
      req.body;
    const { songCoverImage, songAudio } = req.files;

    // Validate song title
    const {
      success: titleSuccess,
      title,
      error: titleError,
    } = songTitleValidator(titleReceived);

    if (!titleSuccess) {
      return res.status(400).json({ message: titleError, success: false });
    }

    // Validate artist
    const {
      success: artistSuccess,
      fullName: artist,
      error: artistError,
    } = fullNameValidator(artistReceived);
    if (!artistSuccess) {
      return res.status(400).json({ message: artistError, success: false });
    }

    // Validate duration
    const {
      success: durationSuccess,
      duration,
      error: durationError,
    } = songDurationValidator(durationReceived);
    if (!durationSuccess) {
      return res.status(400).json({ message: durationError, success: false });
    }

    // Validate album id
    const {
      success: albumIdSuccess,
      mongoDbId: albumId,
      error: albumIdError,
    } = mongoDbIdValidator(albumIdReceived);
    if (!albumIdSuccess) {
      return res.status(400).json({ message: albumIdError, success: false });
    }

    // Upload song cover image to Cloudinary
    const imageUrl = await uploadToCloudinary(songCoverImage as UploadedFile);

    // Upload song audio to Cloudinary
    const audioUrl = await uploadToCloudinary(songAudio as UploadedFile);

    // Create song
    const song = await prisma.songs.create({
      data: {
        title: title as string,
        artist: artist as string,
        imageUrl,
        audioUrl,
        duration: duration as number,
        albumId: albumId as string,
      },
    });

    res
      .status(200)
      .json({ message: 'Song created successfully', success: true, song });
  } catch (error) {
    next({ err: error, field: 'createSong' });
  }
});

export default router;
