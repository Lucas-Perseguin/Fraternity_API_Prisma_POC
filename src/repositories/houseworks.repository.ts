import { houseworks } from '@prisma/client';
import prisma from '../database.js';
import {
  Housework,
  HouseworkEdit,
  HouseworksQueries,
} from '../protocols/houseworks.protocol.js';

export function insertHousework(
  object: Housework,
  responsible: number
): Promise<houseworks> {
  const { name, description, date } = object;
  return prisma.houseworks.create({
    data: {
      name,
      description,
      date,
      responsible,
    },
  });
}

//!Select Houseworks --------------------------------------------------------------------->

export function selectDeliveredLateHouseworks(
  queries: HouseworksQueries
): Promise<houseworks[]> {
  const { id, name, date, responsible } = queries;
  return prisma.houseworks.findMany({
    where: {
      id: id ? Number(id) : undefined,
      name: name
        ? {
            contains: `${name}`,
          }
        : undefined,
      date: date ? `${date}` : undefined,
      responsible: responsible ? Number(responsible) : undefined,
      NOT: {
        completion: null,
      },
      completion: {
        gt: prisma.houseworks.fields.date,
      },
    },
  });
}

export function selectLateHouseworks(
  queries: HouseworksQueries
): Promise<houseworks[]> {
  const { id, name, date, responsible } = queries;
  return prisma.houseworks.findMany({
    where: {
      id: id ? Number(id) : undefined,
      name: name
        ? {
            contains: `${name}`,
          }
        : undefined,
      responsible: responsible ? Number(responsible) : undefined,
      completion: null,
      AND: [
        { date: date ? `${date}` : undefined },
        {
          date: {
            lt: `${Date.now()}`,
          },
        },
      ],
    },
  });
}

export function selectTodayHouseworks(
  queries: HouseworksQueries
): Promise<houseworks[]> {
  const { id, name, done, responsible } = queries;
  return prisma.houseworks.findMany({
    where: {
      id: id ? Number(id) : undefined,
      name: name
        ? {
            contains: `${name}`,
          }
        : undefined,
      done: done === 'true' ? true : false,
      responsible: responsible ? Number(responsible) : undefined,
      date: `${Date.now()}`,
    },
  });
}

export function selectHouseworks(
  queries: HouseworksQueries
): Promise<houseworks[]> {
  const { id, name, date, done, responsible } = queries;
  return prisma.houseworks.findMany({
    where: {
      id: id ? Number(id) : undefined,
      name: name
        ? {
            contains: `${name}`,
          }
        : undefined,
      done: done === 'true' ? true : false,
      responsible: responsible ? Number(responsible) : undefined,
      date: date ? `${date}` : undefined,
    },
  });
}

//!End of Select Houseworks -------------------------------------------------------------->

export function updateHouseworkCompletion(id: number): Promise<houseworks> {
  return prisma.houseworks.update({
    where: {
      id,
    },
    data: {
      done: true,
      completion: `${Date.now()}`,
    },
  });
}

export function updateHouseWork(
  id: number,
  object: HouseworkEdit
): Promise<houseworks> {
  const { name, description, date, responsible } = object;
  return prisma.houseworks.update({
    where: {
      id,
    },
    data: {
      name: name ? name : undefined,
      description: description ? description : undefined,
      date: date ? date : undefined,
      responsible: responsible ? responsible : undefined,
    },
  });
}

export function deleteHouseWorkQuery(id: number): Promise<houseworks> {
  return prisma.houseworks.delete({
    where: {
      id,
    },
  });
}
