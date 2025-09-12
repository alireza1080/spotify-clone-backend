import { NextFunction, Request, Response } from 'express';
import { type UploadedFile } from 'express-fileupload';
import { existsSync, rmSync } from 'node:fs';
import { prisma } from 'services/db.service.js';
import { uploadToCloudinary } from 'utils/uploadToCloudinary.js';
import { albumIdValidator } from 'validators/albumId.validator.js';
import { artistNameValidator } from 'validators/artistName.validator.js';
import { songDurationValidator } from 'validators/songDuration.validator.js';
import { songTitleValidator } from 'validators/songTitle.validator.js';
import { songIdValidator } from 'validators/songId.validator.js';
import { deleteFromCloudinary } from 'utils/deleteFromCloudinary.js';
import { albumTitleValidator } from 'validators/albumTitle.validator.js';
import { releaseYearValidator } from 'validators/releaseYear.validator.js';

const createSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Check if song cover image is present
    if (!req.files?.songCoverImage) {
      return res
        .status(400)
        .json({ message: 'Song cover image is required', success: false });
    }

    //! Check if song audio is present
    if (!req.files?.songAudio) {
      return res
        .status(400)
        .json({ message: 'Song audio is required', success: false });
    }

    const songCoverImage = req.files.songCoverImage as UploadedFile;
    const songAudio = req.files.songAudio as UploadedFile;

    //! Check if song cover image is an image
    if (!songCoverImage?.mimetype?.startsWith('image/')) {
      return res
        .status(400)
        .json({ message: 'Song cover image must be an image', success: false });
    }

    //! Check if the song cover image size is less than 5MB
    if (songCoverImage?.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: 'Song cover image must be less than 5MB',
        success: false,
      });
    }

    //! Check if song audio is an audio
    if (!songAudio?.mimetype?.startsWith('audio/')) {
      return res
        .status(400)
        .json({ message: 'Song audio must be an audio', success: false });
    }

    //! Check if the song audio size is less than 10MB
    if (songAudio?.size > 10 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: 'Song audio must be less than 10MB', success: false });
    }

    //! Check if the request body is present
    if (!req.body) {
      return res.status(400).json({
        message: 'Song Title, Artist, Duration, and Album ID are required',
        success: false,
      });
    }

    //! Destructure the request body
    const {
      title: titleReceived,
      artist: artistReceived,
      duration: durationReceived,
      albumId: albumIdReceived,
    } = req.body;

    //! Check if song title is present
    if (!titleReceived) {
      return res
        .status(400)
        .json({ message: 'Song Title is required', success: false });
    }

    //! Validate song title
    const {
      success: titleSuccess,
      songTitle: title,
      error: titleError,
    } = songTitleValidator(titleReceived);

    if (!titleSuccess) {
      return res.status(400).json({ message: titleError, success: false });
    }

    //! Check if song artist is present
    if (!artistReceived) {
      return res
        .status(400)
        .json({ message: 'Song Artist is required', success: false });
    }

    //! Validate artist
    const {
      success: artistSuccess,
      artistName: artist,
      error: artistError,
    } = artistNameValidator(artistReceived);
    if (!artistSuccess) {
      return res.status(400).json({ message: artistError, success: false });
    }

    //! Check if song duration is present
    if (!durationReceived) {
      return res
        .status(400)
        .json({ message: 'Song Duration is required', success: false });
    }

    //! Validate duration
    const {
      success: durationSuccess,
      duration,
      error: durationError,
    } = songDurationValidator(+durationReceived);
    if (!durationSuccess) {
      return res.status(400).json({ message: durationError, success: false });
    }

    //! Check if album id is present
    if (!albumIdReceived) {
      return res
        .status(400)
        .json({ message: 'Song Album ID is required', success: false });
    }

    //! Validate album id
    const {
      success: albumIdSuccess,
      albumId: albumId,
      error: albumIdError,
    } = albumIdValidator(albumIdReceived);
    if (!albumIdSuccess) {
      return res.status(400).json({ message: albumIdError, success: false });
    }

    //! Check if album exists
    const album = await prisma.albums.findUnique({
      where: {
        id: albumId as string,
      },
    });

    if (!album) {
      return res.status(400).json({
        message: 'Album does not exist in the database',
        success: false,
      });
    }

    //! Upload song cover image to Cloudinary
    const imageUrl = await uploadToCloudinary(
      songCoverImage as UploadedFile,
      'image'
    );

    //! Upload song audio to Cloudinary
    const audioUrl = await uploadToCloudinary(
      songAudio as UploadedFile,
      'audio'
    );

    //! Create song
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
    //! Delete temporary temp folder if it exists
    if (existsSync('./temp')) {
      rmSync('./temp', { recursive: true });
    }
  }
};

const deleteSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Check if request params is present
    if (!req.params) {
      return res
        .status(400)
        .json({ message: 'Song ID is required', success: false });
    }

    //! Check if song id is present in the request params
    if (!req.params.songId) {
      return res
        .status(400)
        .json({ message: 'Song ID is required', success: false });
    }

    const { songId: songIdReceived } = req.params;

    //! Validate song id
    const {
      success: songIdSuccess,
      songId,
      error: songIdError,
    } = songIdValidator(songIdReceived);

    if (!songIdSuccess) {
      return res.status(400).json({ message: songIdError, success: false });
    }

    //! Check if song exists
    const song = await prisma.songs.findUnique({
      where: {
        id: songId as string,
      },
    });

    if (!song) {
      return res.status(400).json({
        message: 'Song does not exist in the database',
        success: false,
      });
    }

    //! Delete song image cover from Cloudinary
    const imageDeletionResult = await deleteFromCloudinary(
      song.imageUrl,
      'image'
    );

    if (!imageDeletionResult) {
      return res.status(400).json({
        message: 'Failed to delete song image cover from Image Storage',
        success: false,
      });
    }

    //! Delete song audio from Cloudinary
    const audioDeletionResult = await deleteFromCloudinary(
      song.audioUrl,
      'audio'
    );

    if (!audioDeletionResult) {
      return res.status(400).json({
        message: 'Failed to delete song audio from Audio Storage',
        success: false,
      });
    }

    //! Delete song from database
    await prisma.songs.delete({
      where: {
        id: songId as string,
      },
    });

    res
      .status(200)
      .json({ message: 'Song deleted successfully', success: true });
  } catch (error) {
    next({ err: error, field: 'deleteSong' });
  }
};

const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Check if album image is present
    if (!req.files?.albumImage) {
      return res
        .status(400)
        .json({ message: 'Album image is required', success: false });
    }

    const albumImage = req.files.albumImage as UploadedFile;

    //! Check if album image is an image
    if (!albumImage?.mimetype?.startsWith('image/')) {
      return res
        .status(400)
        .json({ message: 'Album image must be an image', success: false });
    }

    //! Check if the album image size is less than 5MB
    if (albumImage?.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: 'Album image must be less than 5MB',
        success: false,
      });
    }

    //! Check if the request body is present
    if (!req.body) {
      return res.status(400).json({
        message: 'Album Title, Artist, and Release Year are required',
        success: false,
      });
    }

    //! Destructure the request body
    const {
      title: titleReceived,
      artist: artistReceived,
      releaseYear: releaseYearReceived,
    } = req.body;

    //! Check if album title is present
    if (!titleReceived) {
      return res
        .status(400)
        .json({ message: 'Album Title is required', success: false });
    }

    //! Validate album title
    const {
      success: titleSuccess,
      albumTitle: title,
      error: titleError,
    } = albumTitleValidator(titleReceived);
    if (!titleSuccess) {
      return res.status(400).json({ message: titleError, success: false });
    }

    //! Check if album artist is present
    if (!artistReceived) {
      return res
        .status(400)
        .json({ message: 'Album Artist is required', success: false });
    }

    //! Validate artist
    const {
      success: artistSuccess,
      artistName: artist,
      error: artistError,
    } = artistNameValidator(artistReceived);
    if (!artistSuccess) {
      return res.status(400).json({ message: artistError, success: false });
    }

    //! Check if album release year is present
    if (!releaseYearReceived) {
      return res
        .status(400)
        .json({ message: 'Album Release Year is required', success: false });
    }

    //! Validate release year
    const {
      success: releaseYearSuccess,
      releaseYear: releaseYear,
      error: releaseYearError,
    } = releaseYearValidator(+releaseYearReceived);
    if (!releaseYearSuccess) {
      return res
        .status(400)
        .json({ message: releaseYearError, success: false });
    }

    //! Upload album image to Cloudinary
    const imageUrl = await uploadToCloudinary(
      albumImage as UploadedFile,
      'image'
    );

    //! Create album
    const album = await prisma.albums.create({
      data: {
        title: title as string,
        artist: artist as string,
        imageUrl,
        releaseYear: releaseYear as number,
      },
    });

    res
      .status(200)
      .json({ message: 'Album created successfully', success: true, album });
  } catch (error) {
    next({ err: error, field: 'createAlbum' });
  } finally {
    //! Delete temporary temp folder if it exists
    if (existsSync('./temp')) {
      rmSync('./temp', { recursive: true });
    }
  }
};

const deleteAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        //! Check if request params is present
        if (!req.params) {
            return res
              .status(400)
              .json({ message: 'Album ID is required', success: false });
        }
        
        //! Check if album id is present in the request params
        if (!req.params.albumId) {
            return res
              .status(400)
              .json({ message: 'Album ID is required', success: false });
        }
        
        const { albumId: albumIdReceived } = req.params;

        //! Validate album id
        const {
            success: albumIdSuccess,
            albumId: albumId,
            error: albumIdError,
        } = albumIdValidator(albumIdReceived);
        if (!albumIdSuccess) {
            return res.status(400).json({ message: albumIdError, success: false });
        }

        //! Check if album exists
        const album = await prisma.albums.findUnique({
            where: {
                id: albumId as string,
            },
        });

        if (!album) {
            return res.status(400).json({
                message: 'Album does not exist in the database',
                success: false,
            });
        }

        //! Check if album has songs
        const songs = await prisma.songs.findMany({
            where: {
                albumId: albumId as string,
            },
        });
        
        if (songs.length > 0) {
            return res.status(400).json({
                message: 'Album has songs, please delete the songs first',
                success: false,
            });
        }

        //! Delete album image from Cloudinary
        const imageDeletionResult = await deleteFromCloudinary(
            album.imageUrl,
            'image'
        );

        if (!imageDeletionResult) {
            return res.status(400).json({
                message: 'Failed to delete album image from Image Storage',
                success: false,
            });
        }

        //! Delete album from database
        await prisma.albums.delete({
            where: {
                id: albumId as string,
            },
        });

        res
            .status(200)
            .json({ message: 'Album deleted successfully', success: true });
    } catch (error) {
        next({ err: error, field: 'deleteAlbum' });
    }
};

export { createSong, deleteSong, createAlbum, deleteAlbum };
