import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API = "http://localhost:8080/users";

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

 useEffect(() => {
  const loadUsers = async () => {
    await fetchUsers();
  };

  loadUsers();
}, []);

  // Create or Update
  const handleSubmit = async () => {
    if (!name || !age) {
      alert("Please fill all fields");
      return;
    }

    const userData = {
      name: name,
      age: Number(age),
    };

    try {
      if (editingId) {
        // UPDATE
        await fetch(`${API}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else {
        // CREATE
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Delete
  const deleteUser = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Edit
  const editUser = (user) => {
    setEditingId(user._id);
    setName(user.name);
    setAge(user.age);
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setAge("");
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1>User Management</h1>

        <div className="form">
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {editingId ? "Update User" : "Add User"}
          </button>
        </div>

        <h2>User List</h2>

        <div className="card-container">
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((user) => (
              <div className="card" key={user._id}>
                <h3>{user.name}</h3>
                <p>Age: {user.age}</p>

                <div className="buttons">
                  <button
                    className="edit"
                    onClick={() => editUser(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;