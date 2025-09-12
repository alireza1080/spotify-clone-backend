import { NextFunction, Request, Response } from 'express';
import { prisma } from 'services/db.service.js';

const getAllSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Get all songs
    const songs = await prisma.songs.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ songs, success: true });
  } catch (error) {
    next({ err: error, field: 'getAllSongs' });
  }
};

const getFeaturedSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //! Get 6 random different songs
    const featuredSongs = await prisma.songs.aggregateRaw({
      pipeline: [{ $sample: { size: 6 } }],
    });

    res.status(200).json({ featuredSongs, success: true });
  } catch (error) {
    next({ err: error, field: 'getFeaturedSongs' });
  }
};

const getMadeForYouSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //! Get 4 random different songs
    const madeForYouSongs = await prisma.songs.aggregateRaw({
      pipeline: [{ $sample: { size: 4 } }],
    });

    res.status(200).json({ madeForYouSongs, success: true });
  } catch (error) {
    next({ err: error, field: 'getMadeForYouSongs' });
  }
};

const getTrendingSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //! Get 4 random different songs
    const trendingSongs = await prisma.songs.aggregateRaw({
      pipeline: [{ $sample: { size: 4 } }],
    });

    res.status(200).json({ trendingSongs, success: true });
  } catch (error) {
    next({ err: error, field: 'getTrendingSongs' });
  }
};

export { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs };
