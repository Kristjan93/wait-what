import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ticketsFactory } from '../../data/tickets'
import { User } from '../../types/user'

export const adminLogin = (req: Request, res: Response) => {
  if(!process.env.TOKEN_KEY) {
    throw new Error('Environment variable TOKEN_KEY missing')
  }
  if(!process.env.ADMIN_PASSWORD) {
    throw new Error('Environment variable ADMIN_PASSWORD missing')
  }

  const { password } = req.body

  if(!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(400).send('invalid password')
  }

  const expireTime = 60 * 60 * 24 * 7 // 7 days

  const user: User = {
    role: 'admin',
  }
  const token = jwt.sign(
    { user },
    process.env.TOKEN_KEY,
    { expiresIn: expireTime }
  )

  res
    .cookie('jwt', token, { maxAge: expireTime * 1000, httpOnly: true })
    .json({
      user,
      tickets: ticketsFactory.get(),
      token,
    })
}
