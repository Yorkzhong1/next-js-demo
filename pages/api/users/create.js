// pages/api/users/create.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      // 创建新用户
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      // 定义 users.json 文件的路径
      const filePath = path.resolve(process.cwd(), 'users.json');

      try {
        // 读取现有的用户数据
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const users = JSON.parse(fileData);

        // 创建新的用户对象并添加到用户列表
        const newUser = { id: users.length + 1, name };
        users.push(newUser);

        // 将更新后的用户列表写回文件
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        // 返回创建成功的响应
        res.status(201).json({ message: 'User created', user: newUser });
      } catch (error) {
        // 错误处理
        res.status(500).json({ error: 'Failed to create user' });
      }
      break;

    default:
      // 不支持其他 HTTP 方法
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
