import { bills } from '@prisma/client';
import prisma from '../database.js';
import {
  Bills,
  BillsQueries,
  TotalValueBills,
} from '../protocols/bills.protocols.js';

async function createBill(object: Bills): Promise<bills> {
  const { name, value, date } = object;
  return await prisma.bills.create({
    data: {
      name,
      date: new Date(date),
      value,
    },
  });
}

async function getBills(queries: BillsQueries): Promise<bills[]> {
  const { name, date, paid, id, isLate, paidLate } = queries;
  return await prisma.bills.findMany({
    where: {
      name: name
        ? {
            contains: `${name}`,
            mode: 'insensitive',
          }
        : undefined,
      date: date ? new Date(`${date}`) : undefined,
      paid: paid ? (paid === 'true' ? true : false) : undefined,
      id: id ? Number(id) : undefined,
      AND:
        (isLate && !paidLate) || (paidLate && !isLate)
          ? [
              {
                paymentDate: paidLate
                  ? {
                      gt: prisma.bills.fields.date,
                    }
                  : undefined,
                NOT: paidLate
                  ? {
                      paid: null,
                    }
                  : undefined,
              },
              {
                paid: isLate ? (paid === 'true' ? true : false) : undefined,
                date: isLate
                  ? {
                      lt: new Date(Date.now()),
                    }
                  : undefined,
              },
            ]
          : undefined,
    },
  });
}

async function setBillPaid(id: number): Promise<bills> {
  return await prisma.bills.update({
    where: {
      id,
    },
    data: {
      paid: true,
      paymentDate: new Date(Date.now()),
    },
  });
}

async function patchBill(
  id: number,
  name: string,
  value: number,
  date: Date
): Promise<bills> {
  return await prisma.bills.update({
    where: {
      id,
    },
    data: {
      name: name ? name : undefined,
      value: value ? value : undefined,
      date: date ? new Date(date) : undefined,
    },
  });
}

async function deleteBill(id: number): Promise<bills> {
  return await prisma.bills.delete({
    where: {
      id,
    },
  });
}

async function getPendingBillsValue(): Promise<TotalValueBills> {
  return await prisma.bills.aggregate({
    where: {
      paid: false,
    },
    _sum: {
      value: true,
    },
  });
}

const billsRepository = {
  createBill,
  getBills,
  setBillPaid,
  patchBill,
  deleteBill,
  getPendingBillsValue,
};

export default billsRepository;
