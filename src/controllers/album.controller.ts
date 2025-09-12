import { NextFunction, Request, Response } from "express";
import { prisma } from "services/db.service.js";

const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //! Get all albums
        const albums = await prisma.albums.findMany({
            include: {
                songs: true,
            },
        });
    } catch (error) {
        next({ err: error, field: 'getAlbums' });
    }
}

const getAlbumById = async (req: Request, res: Response, next: NextFunction) => {}

export { getAlbums, getAlbumById };