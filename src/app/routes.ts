import { Router } from 'express';
// Modules will be imported here
import { examRoutes } from '../modules/exams/exam.routes';
import { pyqRoutes } from '../modules/pyqs/pyq.routes';
import { tutorialRoutes } from '../modules/tutorials/tutorial.routes';
import { adminRoutes } from '../modules/admin/admin.routes';

export const apiRoutes = Router();

apiRoutes.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

apiRoutes.use('/exams', examRoutes);
apiRoutes.use('/pyqs', pyqRoutes);
apiRoutes.use('/tutorials', tutorialRoutes);
apiRoutes.use('/admin', adminRoutes);
