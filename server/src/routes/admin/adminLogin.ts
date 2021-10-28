import cookie, { CookieSerializeOptions } from 'cookie'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { INITIAL_DATA_PASSWORD_ADMIN } from '../../data/initial'
import { ticketsFactory } from '../../data/tickets'
import { User } from '../../types/user'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const adminLogin = (req: Request, res: Response) => {
  if(!process.env.TOKEN_KEY) {
    throw new Error('Environment variable TOKEN_KEY missing')
  }

  const { password } = req.body

  if(!password || password !== INITIAL_DATA_PASSWORD_ADMIN) {
    return res.status(400).send('invalid password')
  }

  const expireTime = 60 * 60 * 24 * 365 // One week

  const options: CookieSerializeOptions = {
    maxAge: expireTime,
    httpOnly: process.env.NODE_ENV !== 'development',
    domain: '/'
    // secure: process.env.NODE_ENV !== 'development',
  }
  
  const user:User = {
    role: 'admin',
  }
  const token = jwt.sign(
    { user },
    process.env.TOKEN_KEY,
    { expiresIn: expireTime }
  )

  res.setHeader('Set-Cookie', cookie.serialize('jwt', token, options))
  res
    .cookie('jwt', token, { maxAge: expireTime, httpOnly: true })
    .json({ 
      user, 
      tickets: ticketsFactory,
      token,
    })
}
