import { bills } from '@prisma/client';
import QueryString from 'qs';

export type Bills = Omit<bills, 'id' | 'paymentDate' | 'paid'>;

export type BillsQueries = {
  name: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  date: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  paid: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  id: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  isLate: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  paidLate: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
};

export type TotalValueBills = {
  _sum: {
    value: number;
  };
};
