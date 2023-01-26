import { residents } from '@prisma/client';
import prisma from '../database.js';
import { Resident, ResidentsQueries } from '../protocols/residents.protocol.js';

export function insertResident(object: Resident): Promise<residents> {
  return prisma.residents.create({ data: { name: object.name } });
}

export function selectResidents(
  queries: ResidentsQueries
): Promise<residents[]> {
  const { id, name, isActive } = queries;
  return prisma.residents.findMany({
    where: {
      id: id ? Number(id) : undefined,
      name: name
        ? {
            contains: `${name}`,
          }
        : undefined,
      isActive: isActive === 'true' ? true : false,
    },
  });
}

export function setResidentInactive(id: number): Promise<residents> {
  return prisma.residents.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}

export function selectUserActitivyById(
  id: number
): Promise<{ isActive: boolean }> {
  return prisma.residents.findUnique({
    where: {
      id,
    },
    select: {
      isActive: true,
    },
  });
}

export function deleteResidentQuery(id: number): Promise<residents> {
  return prisma.residents.delete({
    where: {
      id,
    },
  });
}
