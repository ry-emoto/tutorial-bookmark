import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

// リクエストとレスポンスの型を指定しています
export default async function (req: NextApiRequest, res: NextApiResponse) {
  // ここで、req のオブジェクトから認証情報を取得しています
  const session = await getSession({ req });

  // session オブジェクトに email が存在しているかを判定しています
  // Prisma によるスキーマの作成を行なった際に、users テーブルの email カラムは必須にしたので、ログインしていれば email にはメールアドレスが格納されているはずです
  if (session?.user?.email) {
    const result = await prisma.article.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        users: {
          connect: { email: session?.user?.email },
        },
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
}
