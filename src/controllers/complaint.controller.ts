import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { analyzeComplaint } from '../services/gemini.service';

export async function createComplaint(req: AuthRequest, res: Response) {
  try {
    const { title, description, latitude, longitude, photoUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // 🤖 AI-powered analysis: auto-categorize, set urgency, generate summary
    let category = 'Other';
    let urgency = 'low';
    let aiSummary = description;

    try {
      const analysis = await analyzeComplaint(title, description);
      category = analysis.category;
      urgency = analysis.urgency;
      aiSummary = analysis.summary;
      console.log(`[Gemini] Category: ${category}, Urgency: ${urgency}`);
    } catch (aiError) {
      console.error('[Gemini] AI analysis failed, using defaults:', aiError);
      // Complaint still saved with default values — no hard failure
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category,
        urgency,
        latitude,
        longitude,
        photoUrl,
        userId: req.userId as string,
      },
    });

    res.status(201).json({
      message: 'Complaint filed successfully',
      complaint,
      aiSummary,
    });
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
export async function updateComplaintStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['filed', 'assigned', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status },
    });

    await prisma.complaintStatusLog.create({
      data: {
        complaintId: id,
        status,
        changedBy: req.userId as string,
        note,
      },
    });

    res.status(200).json({ message: 'Status updated successfully', complaint });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}