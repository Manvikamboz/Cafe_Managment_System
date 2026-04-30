import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'menu') {
        const { data } = await API.get('/menu');
        setItems(data);
      } else if (activeTab === 'users') {
        const { data } = await API.get('/users');
        setUsers(data);
      }
    } catch (err) {
      toast.error('Failed to fetch data');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/menu/${id}`);
      toast.success('Item deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await API.put(`/users/${userId}/role`, { role });
      toast.success('Role updated');
      fetchData();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <section className="container">
      <h1 className="page-title">Admin Dashboard</h1>
      
      <div className="tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn-${activeTab === 'menu' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('menu')}
        >
          Manage Menu
        </button>
        <button 
          className={`btn-${activeTab === 'users' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'menu' ? (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Menu Items</h3>
              <button className="btn-primary">+ Add New Item</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.isAvailable ? 'Available' : 'Sold Out'}</td>
                    <td>
                      <button className="btn-secondary" style={{ marginRight: '0.5rem' }}>Edit</button>
                      <button className="btn-danger" onClick={() => deleteItem(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card">
            <h3>Registered Users</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select 
                        value={u.role} 
                        onChange={(e) => updateUserRole(u._id, e.target.value)}
                        disabled={u.role === 'admin'}
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-danger" disabled={u.role === 'admin'}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
