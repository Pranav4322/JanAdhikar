import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { checkExpenseAnomalies } from '../services/anomaly.service';

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { title, department, budgetAllocated, contractorName, tenderReference, startDate, expectedEndDate } = req.body;

    if (!title || !department || !budgetAllocated || !contractorName) {
      return res.status(400).json({ error: 'Title, department, budgetAllocated, and contractorName are required' });
    }

    const project = await prisma.govProject.create({
      data: {
        title,
        department,
        budgetAllocated,
        contractorName,
        tenderReference,
        startDate: startDate ? new Date(startDate) : undefined,
        expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : undefined,
      },
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function getAllProjects(req: AuthRequest, res: Response) {
  try {
    const projects = await prisma.govProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function getProjectById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const project = await prisma.govProject.findUnique({
      where: { id },
      include: { expenses: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function addExpense(req: AuthRequest, res: Response) {
  try {
    const projectId = req.params.id as string;
    const { amount, description, receiptReference } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Amount and description are required' });
    }

    const { flagged, reason } = await checkExpenseAnomalies(projectId, amount);

    const expense = await prisma.expense.create({
      data: {
        projectId,
        amount,
        description,
        receiptReference,
        flagged,
        flagReason: reason,
      },
    });

    res.status(201).json({
      message: flagged ? 'Expense added, but flagged as anomalous' : 'Expense added successfully',
      expense,
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
