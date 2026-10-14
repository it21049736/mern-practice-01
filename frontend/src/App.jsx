
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // READ - Get all items
  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load items.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // CREATE and UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      name,
      description,
      price: Number(price),
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, itemData);
      } else {
        await axios.post(API_URL, itemData);
      }

      setName("");
      setDescription("");
      setPrice("");
      setEditId(null);
      setError("");
      await fetchItems();
    } catch (err) {
      setError("Failed to save item.");
      console.error(err);
    }
  };

  // EDIT - Fill form with existing item
  const handleEdit = (item) => {
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setEditId(item._id);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchItems();
    } catch (err) {
      setError("Failed to delete item.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>MERN Item Manager</h1>

      <h2>{editId ? "Edit Item" : "Add New Item"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          required
        />

        <button type="submit">
          {editId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      <h2>Item List</h2>

      {items.length === 0 ? (
        <p>No items available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
