"use client"
// pages/page.js
// pages/page.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.css'; // 引入 CSS 模块

export default function UsersPage() {
  const [users, setUsers] = useState([]); // 保存用户列表
  const [newUserName, setNewUserName] = useState(''); // 保存新用户的名字
  const [error, setError] = useState(''); // 错误信息
  const [loading, setLoading] = useState(false); // 加载状态

  // 获取用户列表的函数
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.users); // 更新用户列表
      // console.log('users:',response.data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users');
    }
  };

  // 在页面加载时，获取所有用户
  useEffect(() => {
    fetchUsers();
  }, []);

  // 提交表单时，添加新用户的函数
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/users', {
        name: newUserName,
      });

      setUsers((prevUsers) => [...prevUsers, response.data.user]); // 添加新用户到列表
      setNewUserName(''); // 清空输入框
    } catch (error) {
      console.error('Failed to add user:', error);
      setError('Failed to add user');
    } finally {
      setLoading(false);
      
    }
  };

  // 删除用户的函数
  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    console.log('id',id)
  
    setLoading(true);
    setError('');
  
    try {
      await axios.delete('/api/users', { data: { id } });
      // Refetch users after deleting
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
      setError('');
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user');
    } finally {
      
      setLoading(false); // 确保 loading 状态在操作完成后被重置
      console.log('setLoadingfalse',loading)
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.addUserTitle}>Add New User</h2>
      <form onSubmit={handleAddUser} className={styles.addUserForm}>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Enter user name"
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
      <h1 className={styles.title}>User List</h1>
      <ul className={styles.userList}>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className={styles.userItem}>
              {user.name}
              <button
                onClick={() => handleDeleteUser(user._id)}
                className={styles.deleteButton}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>



      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
