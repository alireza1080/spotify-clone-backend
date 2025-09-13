import { NextFunction, Request, Response } from 'express';
import { prisma } from 'services/db.service.js';

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Number of total songs, albums, users
    const [totalSongs, totalAlbums, totalUsers, songArtists, albumArtists] =
      await Promise.all([
        prisma.songs.count(),
        prisma.albums.count(),
        prisma.users.count(),
        prisma.songs.findMany({
          distinct: ['artist'],
          select: {
            artist: true,
          },
        }),
        prisma.albums.findMany({
          distinct: ['artist'],
          select: {
            artist: true,
          },
        }),
      ]);

    //! Number of total artists
    const allArtists = new Set([
      ...songArtists.map((artist) => artist.artist),
      ...albumArtists.map((artist) => artist.artist),
    ]);

    //! Number of total artists
    const totalArtists = allArtists.size;

    const stats = {
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtists,
    };

    //! Return the stats
    res.status(200).json({ stats, success: true });
  } catch (error) {
    next({ err: error, field: 'getStats' });
  }
};

export { getStats };