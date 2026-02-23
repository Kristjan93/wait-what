import { Request, Response } from 'express'

export const logout = (req: Request, res: Response) => {
  return res.clearCookie('jwt').send('logged out')
}
