// pages/api/users.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // 定义 users.json 文件的路径
      const filePath = path.resolve(process.cwd(), 'users.json');
      
      try {
        // 读取文件内容
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const users = JSON.parse(fileData); // 解析文件中的 JSON 数据

        // 返回用户列表
        res.status(200).json({ message: 'List of users', users });
      } catch (error) {
        // 错误处理，如果文件读取失败
        res.status(500).json({ error: 'Failed to read users file' });
      }
      break;

    default:
      // 不支持其他 HTTP 方法
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
