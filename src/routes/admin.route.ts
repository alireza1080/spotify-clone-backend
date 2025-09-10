import { Router } from 'express';
import { type UploadedFile } from 'express-fileupload';
import { existsSync, rmSync } from 'node:fs';
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

    const songCoverImage = req.files.songCoverImage as UploadedFile;
    const songAudio = req.files.songAudio as UploadedFile;

    // Check if song cover image is an image
    if (!songCoverImage?.mimetype?.startsWith('image/')) {
      return res
        .status(400)
        .json({ message: 'Song cover image must be an image', success: false });
    }

    // Check if the song cover image size is less than 5MB
    if (songCoverImage?.size > 5 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: 'Song cover image must be less than 5MB', success: false });
    }

    // Check if song audio is an audio
    if (!songAudio?.mimetype?.startsWith('audio/')) {
      return res
        .status(400)
        .json({ message: 'Song audio must be an audio', success: false });
    }

    // Check if the song audio size is less than 10MB
    if (songAudio?.size > 10 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: 'Song audio must be less than 10MB', success: false });
    }

    console.log(songCoverImage, songAudio);
    console.log(req.body);
    const { titleReceived, artistReceived, durationReceived, albumIdReceived } =
      req.body;

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
  } finally {
    // Delete temporary temp folder if it exists
    if (existsSync('./temp')) {
      rmSync('./temp', { recursive: true });
    }
  }
});

export default router;
