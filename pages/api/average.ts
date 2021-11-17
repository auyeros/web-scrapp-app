import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: 'ay ezta graza que no se kita' })
}