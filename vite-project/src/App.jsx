import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // Fetch all users
  const fetchUsers = () => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  };

  // Run once when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const createUser = () => {
    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        age: Number(age),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setName("");
        setAge("");
        fetchUsers();
      });
  };

  // Delete user
  const deleteUser = (id) => {
    fetch(`http://localhost:8080/users/${id}`, {
      method: "DELETE",
    }).then(() => fetchUsers());
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>User Management</h1>

      <h2>Add User</h2>
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
      <button onClick={createUser}>Add User</button>

      <h2>User List</h2>

      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <span>
            {user.name} - {user.age}
          </span>
          <button
            onClick={() => deleteUser(user.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;