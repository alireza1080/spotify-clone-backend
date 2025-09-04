import { prisma } from 'services/db.service.js';
import { Request, Response } from 'express';
import { clerkIdValidator } from 'validators/clerkId.validator.js';
import { firstNameValidator } from 'validators/firstName.validator.js';

const authCallback = async (req: Request, res: Response) => {
  try {
    // Check if request body is present
    if (!req.body) {
      return res
        .status(400)
        .json({ message: 'Request body is required', success: false });
    }

    const {
      receivedClerkId,
      receivedFirstName,
      receivedLastName,
      receivedImageUrl,
    } = req.body;

    // Check if clerkId is valid
    const { clerkId, error } = clerkIdValidator(receivedClerkId);

    if (!clerkId) {
      return res.status(400).json({ message: error, success: false });
    }

    // Check if user already exists
    const user = await prisma.users.findUnique({
      where: {
        clerkId,
      },
    });

    if (user) {
      return res.status(200).json({ message: 'User already exists', success: true });
    }

    // Check if first name is valid
    const { firstName, error: firstNameError } = firstNameValidator(receivedFirstName);
    if (!firstName) {
      return res.status(400).json({ message: firstNameError, success: false });
    }

    await prisma.users.create({
      data: {
        clerkId,
        fullName: `${receivedFirstName} ${receivedLastName}`,
        imageUrl: receivedImageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res
      .status(200)
      .json({ message: 'User created successfully', success: true });
  } catch (error) {
    console.error('Error creating user', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export { authCallback };
