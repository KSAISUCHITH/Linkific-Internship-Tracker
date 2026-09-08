import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api/foods';

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setFoods(data);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setMessage({
        type: 'error',
        text: 'Unable to connect to the backend server. Please make sure FastAPI is running on http://127.0.0.1:8000',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const parsedPrice = parseFloat(price);

    if (!trimmedName) {
      setMessage({ type: 'error', text: 'Food Name is required and cannot be empty.' });
      return false;
    }

    if (!trimmedCategory) {
      setMessage({ type: 'error', text: 'Category is required and cannot be empty.' });
      return false;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMessage({ type: 'error', text: 'Price must be a valid number greater than 0.' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const foodPayload = {
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
    };

    try {
      if (editingId !== null) {
        const response = await fetch(`${API_BASE_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodPayload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Failed to update food item');
        }

        setMessage({ type: 'success', text: `"${foodPayload.name}" updated successfully!` });
        handleCancelEdit();
      } else {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodPayload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Failed to add food item');
        }

        setMessage({ type: 'success', text: `"${foodPayload.name}" added successfully!` });
        resetForm();
      }

      fetchFoods();
    } catch (err) {
      console.error('API Error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred while saving the food item.',
      });
    }
  };

  const handleEdit = (food) => {
    setEditingId(food.id);
    setName(food.name);
    setCategory(food.category);
    setPrice(food.price.toString());
    setMessage(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
  };

  const handleDelete = async (id, foodName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${foodName}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to delete food item');
      }

      setMessage({ type: 'success', text: `"${foodName}" deleted successfully!` });

      if (editingId === id) {
        handleCancelEdit();
      }

      fetchFoods();
    } catch (err) {
      console.error('Delete Error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'An error occurred while deleting the food item.',
      });
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Food Menu Manager</h1>
      </header>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          <span>{message.text}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setMessage(null)}
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <section className="form-card">
        <h2 className="form-title">
          {editingId !== null ? 'Edit Food Item' : 'Add New Food Item'}
        </h2>
        <form onSubmit={handleSubmit} className="food-form">
          <div className="form-group">
            <label htmlFor="food-name">Food Name</label>
            <input
              id="food-name"
              type="text"
              placeholder="e.g. Margherita Pizza"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="food-category">Category</label>
            <input
              id="food-category"
              type="text"
              placeholder="e.g. Pizza, Burger, Beverage"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="food-price">Price (₹)</label>
            <input
              id="food-price"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 250"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId !== null ? 'Update Food' : 'Add Food'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="list-section">
        <div className="list-header">
          <h2>Menu Items</h2>
          <span className="count-badge">{foods.length} {foods.length === 1 ? 'item' : 'items'}</span>
        </div>

        {loading ? (
          <div className="loading-state">Loading food items...</div>
        ) : foods.length === 0 ? (
          <div className="empty-state">
            <p>No food items found in the menu.</p>
            <p className="empty-subtitle">Use the form above to add your first food item!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="foods-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food.id} className={editingId === food.id ? 'row-editing' : ''}>
                    <td className="id-cell">{food.id}</td>
                    <td className="name-cell">{food.name}</td>
                    <td>
                      <span className="category-tag">{food.category}</span>
                    </td>
                    <td className="price-cell">₹{Number(food.price).toFixed(2)}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEdit(food)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDelete(food.id, food.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
