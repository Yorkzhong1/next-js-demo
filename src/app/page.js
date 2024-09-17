"use client"
// pages/page.js
import { useEffect, useState } from 'react';
import styles from './page.module.css'; // 引入 CSS 模块

export default function UsersPage() {
  const [users, setUsers] = useState([]); // 保存用户列表
  const [newUserName, setNewUserName] = useState(''); // 保存新用户的名字
  const [error, setError] = useState(''); // 错误信息
  const [loading, setLoading] = useState(false); // 加载状态

  // 获取用户列表的函数
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users); // 更新用户列表
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newUserName }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers((prevUsers) => [...prevUsers, data.user]); // 添加新用户到列表
        setNewUserName(''); // 清空输入框
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add user');
      }
    } catch (error) {
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

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 从列表中移除被删除的用户
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User List</h1>
      <ul className={styles.userList}>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              {user.id}: {user.name}
              <button
                onClick={() => handleDeleteUser(user.id)}
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

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
