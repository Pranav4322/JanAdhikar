import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../services/auth.service';
import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { verifyVoterId } from '../services/voterVerification.service';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, voterId } = req.body;

    if (!name || !email || !password || !voterId) {
      return res.status(400).json({ error: 'Name, email, password, and voter ID are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const { verified, reason } = await verifyVoterId(voterId);
    if (!verified) {
      return res.status(400).json({ error: reason || 'Voter ID verification failed' });
    }

    const existingVoterId = await prisma.user.findUnique({ where: { voterId } });
    if (existingVoterId) {
      return res.status(409).json({ error: 'This Voter ID is already registered' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, voterId, isVoterVerified: verified },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isVoterVerified: user.isVoterVerified },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isVoterVerified: user.isVoterVerified },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}