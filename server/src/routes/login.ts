import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../types/user'

export const login = (req: Request, res: Response) => {
  if(!process.env.TOKEN_KEY) {
    throw new Error('Environment variable TOKEN_KEY missing')
  }

  const { name, phone } = req.body

  if(!name) {
    return res.status(400).send('invalid username')
  }
  if(!phone) {
    return res.status(400).send('invalid phone number')
  }

  const expireTime = 60 * 60 * 24 * 7 // 7 days

  const user: User = {
    role: 'user',
    name,
    phone,
  }
  const token = jwt.sign(
    { user },
    process.env.TOKEN_KEY,
    { expiresIn: expireTime }
  )

  res
    .cookie('jwt', token, { maxAge: expireTime * 1000, httpOnly: true })
    .json({ token })
}
