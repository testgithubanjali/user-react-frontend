import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:8080/users";

  // Fetch Users
  const fetchUsers = () => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = () => {
    if (!name || !age) return alert("Fill all fields");

    if (editingId) {
      fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number(age) }),
      }).then(() => {
        resetForm();
        fetchUsers();
      });
    } else {
      fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number(age) }),
      }).then(() => {
        resetForm();
        fetchUsers();
      });
    }
  };

  const deleteUser = (id) => {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => fetchUsers());
  };

  const editUser = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setAge(user.age);
  };

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
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter age"
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
              <div className="card" key={user.id}>
                <h3>{user.name}</h3>
                <p>Age: {user.age}</p>
                <div className="buttons">
                  <button className="edit" onClick={() => editUser(user)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteUser(user.id)}
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