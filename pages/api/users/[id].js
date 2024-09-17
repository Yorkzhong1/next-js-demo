// pages/api/users/[id].js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // 从 URL 参数中获取用户 ID

  // 定义 users.json 文件的路径
  const filePath = path.resolve(process.cwd(), 'users.json');

  switch (method) {
    case 'DELETE':
      try {
        // 读取现有的用户数据
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const users = JSON.parse(fileData);

        // 查找用户是否存在
        const userIndex = users.findIndex((user) => user.id === parseInt(id, 10));

        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }

        // 删除用户
        users.splice(userIndex, 1);

        // 将更新后的用户列表写回文件
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');

        // 返回成功响应
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
      }
      break;

    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
