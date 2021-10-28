import cookie, { CookieSerializeOptions } from 'cookie'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../types/user'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  const expireTime = 60 * 60 * 24 * 365 // One week

  const options: CookieSerializeOptions = {
    maxAge: expireTime,
    // httpOnly: process.env.NODE_ENV !== 'development',
    httpOnly: false,
    domain: process.env.NODE_ENV === 'production' ? 'https://wait-what.herokuapp.com' : '/'
    // secure: process.env.NODE_ENV !== 'development',
  }
  
  const user:User = {
    role: 'user',
    name,
    phone,
  }
  const token = jwt.sign(
    { user },
    process.env.TOKEN_KEY,
    { expiresIn: expireTime }
  )

  res.setHeader('Set-Cookie', cookie.serialize('jwt', token, options))
  res
    .cookie('jwt', token, { maxAge: expireTime, httpOnly: true })
    .json({ token })
}
