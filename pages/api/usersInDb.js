// pages/api/users/create.js

import { MongoClient,ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
// const { MongoClient, ServerApiVersion } = require('mongodb');

// 加载环境变量
dotenv.config();


const uri = "mongodb+srv://yorkzhong:1234@cluster0.u4slkcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB 连接设置
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
const dbName = 'next-js-demo';  // 替换为你的数据库名
const collectionName = 'users';  // 替换为你的集合名

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
        console.log('getting user')
      try {
        // 连接到 MongoDB
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 获取所有用户
        const users = await collection.find({}).toArray();

        // 返回用户列表
        res.status(200).json({ users });
      } catch (error) {
        // 错误处理
        console.error('Failed to fetch users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
      } finally {
        // 关闭 MongoDB 连接
        await client.close();
      }
      break;

    case 'DELETE':
      try {
        // 连接到 MongoDB
        console.log('deleting user')
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 获取请求体中的数据
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        console.log('already connected to DB')
        // 删除用户
        const result = await collection.deleteOne({ _id: new MongoClient.ObjectId(id) });

        console.log('deleted')
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        // 返回删除成功的响应
        res.status(200).json({ message: 'User deleted' });
      } catch (error) {
        // 错误处理
        console.error('Failed to delete user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
      } finally {
        // 关闭 MongoDB 连接
        await client.close();
      }
      break;

    default:
      // 不支持其他 HTTP 方法
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
