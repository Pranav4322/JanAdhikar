import { Router } from 'express';
import { createComplaint, getMyComplaints, updateComplaintStatus } from '../controllers/complaint.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createComplaint);
router.get('/mine', authenticate, getMyComplaints);
router.patch('/:id/status', authenticate, requireRole('official', 'admin'), updateComplaintStatus);

export default router;