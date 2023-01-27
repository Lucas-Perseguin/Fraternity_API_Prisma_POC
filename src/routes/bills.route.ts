import { Router } from 'express';
import billsController from '../controllers/bills.controller.js';
import modelValidation from '../middlewares/validateModel.middleware.js';
import { BillModel } from '../models/models.js';

const router = Router();

router.post('/bills', modelValidation(BillModel), billsController.postBill);
router.get('/bills', billsController.getBills);
router.post('/bills/:id/paid', billsController.setBillPaid);
router.patch('/bills/:id', billsController.patchBill);
router.delete('/bills/:id', billsController.deleteBill);
router.get('/bills/pending', billsController.getPendingBillsValue);

export default router;
