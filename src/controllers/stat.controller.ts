import { NextFunction, Request, Response } from 'express';
import { prisma } from 'services/db.service.js';

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Number of total songs, albums, users
    const [totalSongs, totalAlbums, totalUsers] = await Promise.all([
      prisma.songs.count(),
      prisma.albums.count(),
      prisma.users.count(),
    ]);

    //! Return the stats
    res
      .status(200)
      .json({ totalSongs, totalAlbums, totalUsers, success: true });
  } catch (error) {
    next({ err: error, field: 'getStats' });
  }
};
