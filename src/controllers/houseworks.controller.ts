import { Request, Response } from 'express';
import { HouseworkEntity } from '../protocols/houseworks.protocol.js';
import {
  deleteHouseWorkQuery,
  insertHousework,
  selectDeliveredLateHouseworks,
  selectHouseworks,
  selectLateHouseworks,
  selectTodayHouseworks,
  updateHouseWork,
  updateHouseworkCompletion,
} from '../repositories/houseworks.repository.js';

export async function createHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  try {
    const createdHousework = await insertHousework(
      req.body,
      Number(req.params.residentId)
    );
    return res.status(201).send(createdHousework);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getHouseworks(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity | HouseworkEntity[]>> {
  const { id, name, date, done, deliveredLate, isLate, today, responsible } =
    req.query;

  if (
    (isLate && today) ||
    (isLate && deliveredLate) ||
    (deliveredLate && today)
  )
    return res
      .status(400)
      .send('You can only select one between isLate, today and deliveredLate');

  try {
    if (isLate) {
      const houseworks = await selectLateHouseworks({
        id,
        name,
        date,
        responsible,
      });
      return res.send(houseworks);
    } else if (today) {
      const houseworks = await selectTodayHouseworks({
        id,
        name,
        done,
        responsible,
      });
      return res.send(houseworks);
    } else if (deliveredLate) {
      const houserworks = await selectDeliveredLateHouseworks({
        id,
        name,
        date,
        responsible,
      });
      return res.send(houserworks);
    } else {
      const houserworks = await selectHouseworks({
        id,
        name,
        date,
        done,
        responsible,
      });
      return res.send(houserworks);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function completeHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  const { houseworkId } = req.params;
  try {
    const housework = await updateHouseworkCompletion(Number(houseworkId));
    if (!housework)
      return res.status(404).send('The specified housework was not found');
    return res.send(housework);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function editHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  const { houseworkId } = req.params;
  try {
    const housework = await updateHouseWork(Number(houseworkId), req.body);
    if (!housework)
      return res.status(404).send('The specified housework was not found');
    return res.send(housework);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function delteHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  const { houseworkId } = req.params;
  try {
    const housework = await deleteHouseWorkQuery(Number(houseworkId));
    if (!housework)
      return res.status(404).send('The specified housework was not found');
    return res.send(housework);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
