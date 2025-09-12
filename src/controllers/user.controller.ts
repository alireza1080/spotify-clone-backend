import { NextFunction, Request, Response } from 'express';
import { prisma } from 'services/db.service.js';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //! Get the current user
    const { userId: currentUserId } = req.auth;

    //! Get all users except the current user
    const users = await prisma.users.findMany({
      where: {
        clerkId: {
          not: currentUserId,
        },
      },
    });

    //! Return the users
    res.status(200).json({ users, success: true });
  } catch (error) {
    next({ err: error, field: 'getAllUsers' });
  }
};

export { getAllUsers };
