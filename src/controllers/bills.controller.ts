import { bills } from '@prisma/client';
import { Request, Response } from 'express';
import {
  Bills,
  BillsQueries,
  TotalValueBills,
} from '../protocols/bills.protocols.js';
import billsRepository from '../repositories/bills.respository.js';

async function postBill(req: Request, res: Response): Promise<Response<bills>> {
  if (req.query.isLate && req.query.paidLate)
    return res
      .status(400)
      .send('Only one of isLate and paidLate can be used at a time!');
  try {
    const createdBill = await billsRepository.createBill(req.body);
    if (!createdBill) return res.sendStatus(400);
    return res.status(201).send(createdBill);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function getBills(
  req: Request,
  res: Response
): Promise<Response<bills[]>> {
  try {
    const bills = await billsRepository.getBills(req.query as BillsQueries);
    if (!bills) return res.sendStatus(400);
    return res.status(200).send(bills);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function setBillPaid(
  req: Request,
  res: Response
): Promise<Response<bills>> {
  const { id } = req.params;
  try {
    const bill = await billsRepository.setBillPaid(Number(id));
    if (!bill) return res.sendStatus(400);
    return res.status(200).send(bill);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function patchBill(
  req: Request,
  res: Response
): Promise<Response<bills>> {
  const { id } = req.params;
  const { name, value, date } = req.body as Bills;
  try {
    const bill = await billsRepository.patchBill(Number(id), name, value, date);
    if (!bill) return res.sendStatus(400);
    return res.status(200).send(bill);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function deleteBill(
  req: Request,
  res: Response
): Promise<Response<bills>> {
  const { id } = req.params;
  try {
    const bill = await billsRepository.deleteBill(Number(id));
    if (!bill) return res.sendStatus(400);
    return res.status(200).send(bill);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function getPendingBillsValue(
  req: Request,
  res: Response
): Promise<Response<TotalValueBills>> {
  try {
    const value = await billsRepository.getPendingBillsValue();
    if (!value) return res.sendStatus(400);
    return res.status(200).send(value._sum);
  } catch (error) {
    res.sendStatus(500);
  }
}

const billsController = {
  postBill,
  getBills,
  setBillPaid,
  patchBill,
  deleteBill,
  getPendingBillsValue,
};

export default billsController;
