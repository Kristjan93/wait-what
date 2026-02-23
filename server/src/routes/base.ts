import { Request, Response } from 'express'
import { ticketsFactory } from '../data/tickets'
import { User } from '../types/user'

export const base = (req: Request, res: Response) => {
  const user = res.locals.decoded.user as User
  const response = {
    tickets: ticketsFactory.get(),
    userTicket: user.phone ? ticketsFactory.getActiveByPhone(user.phone) : undefined,
    user,
  }
  res.json(response)
}
