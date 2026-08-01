import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createComplaint(req: AuthRequest, res: Response) {
  try {
    const { title, description, latitude, longitude, photoUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        latitude,
        longitude,
        photoUrl,
        userId: req.userId as string,
      },
    });

    res.status(201).json({ message: 'Complaint filed successfully', complaint });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function getMyComplaints(req: AuthRequest, res: Response) {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId: req.userId as string },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}