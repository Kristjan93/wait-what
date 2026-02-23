import { Request, Response } from 'express'
import { Server } from 'socket.io'
import { ticketsFactory } from '../data/tickets'
import { User } from '../types/user'

export const ticketsPost = (io: Server) => (req: Request, res: Response) => {
  const user = res.locals.decoded.user as User

  if(user.role === 'admin') {
    return res.status(400).send('Admin can not perform this action')
  }

  const { name, phone } = user
  if(ticketsFactory.getActiveByPhone(phone)) {
    return res.status(409).send('User already has a ticket')
  }

  const ticket = ticketsFactory.add({ phone, name })

  io.emit('tickets', { tickets: ticketsFactory.get() })
  return res.json({ ticket })
}

export const ticketsGet = (req: Request<{ id: string }>, res: Response) => {
  const { ticket } = ticketsFactory.getById(req.params.id)
  if(!ticket) {
    return res.status(404).send('not found')
  }

  return res.json(ticket)
}

export const ticketsPutCancel = (io: Server) => (req: Request<{ id: string }>, res: Response) => {
  const { phone } = res.locals.decoded.user as User
  const { id } = req.params

  const { ticket } = ticketsFactory.getById(id)
  if (!ticket) {
    return res.status(404).end()
  }
  if(ticket.status === 'canceled') {
    return res.status(404).send('already canceled')
  }
  if(ticket.phone !== phone) {
    return res.status(403).send('Forbidden')
  }

  ticketsFactory.update({
    ...ticket,
    status: 'canceled'
  })

  const tickets = ticketsFactory.get()
  io.emit('tickets', { tickets })

  return res.json(ticket)
}
