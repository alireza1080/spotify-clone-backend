import { NextFunction, Request, Response } from 'express';
import { prisma } from 'services/db.service.js';
import { albumIdValidator } from 'validators/albumId.validator.js';

const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Get all albums
    const albums = await prisma.albums.findMany({});

    res.status(200).json({ albums, success: true });
  } catch (error) {
    next({ err: error, field: 'getAlbums' });
  }
};

const getAlbumById = async (
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
      albumId,
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

    //! Check if album exists
    const songs = await prisma.songs.findMany({
      where: {
        albumId: albumId as string,
      },
    });

    const albumWithSongs = {
      ...album,
      songs,
    };

    res.status(200).json({ album: albumWithSongs, success: true });
  } catch (error) {
    next({ err: error, field: 'getAlbumById' });
  }
};

export { getAlbums, getAlbumById };
