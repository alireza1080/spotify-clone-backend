import { NextFunction, Request, Response } from 'express';
import { prisma } from 'services/db.service.js';
import { songIdValidator } from 'validators/songId.validator.js';

const getSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Get all songs
    const songs = await prisma.songs.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ songs, success: true });
  } catch (error) {
    next({ err: error, field: 'getSongs' });
  }
};

const getSongById = async (req: Request, res: Response, next: NextFunction) => {
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

    res.status(200).json({ song, success: true });
  } catch (error) {
    next({ err: error, field: 'getSongById' });
  }
};

export { getSongs, getSongById };
