import { NextFunction, Request, Response } from 'express';
import { clerkClient } from '@clerk/express';
import { config } from 'dotenv';

config();

const adminEmail = process.env.ADMIN_EMAIL;

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;

    const user = await clerkClient.users.getUser(userId);
    if (user.primaryEmailAddress?.emailAddress !== adminEmail) {
      return res.status(401).json({
        message: 'Unauthorized - You must be an admin to access this resource',
        success: false,
      });
    }
    next();
  } catch (error) {
    console.error('Error checking if user is admin', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export { isAdmin };
