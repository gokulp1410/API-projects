import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
        const data = response.data;

        setUsers(
          Array.isArray(data)
            ? data
            : Array.isArray(data.users)
              ? data.users
              : [],
        );
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load users. Check your backend API.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Open edit form
  function handleEdit(user) {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
    });
    setMessage("");
    setError("");
  }

  // Update form fields
  function handleChange(e) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }

  // Save edited user
  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const userId = editingUser._id || editingUser.id;

      await api.put(`/users/${userId}`, editForm);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          (user._id || user.id) === userId ? { ...user, ...editForm } : user,
        ),
      );

      setEditingUser(null);
      setMessage("User updated successfully!");
      setError("");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Unable to update user.");
    }
  }

  // Delete user
  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) return;

    try {
      const userId = user._id || user.id;

      await api.delete(`/users/${userId}`);

      setUsers((previousUsers) =>
        previousUsers.filter((item) => (item._id || item.id) !== userId),
      );

      setMessage("User deleted successfully!");
      setError("");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || "Unable to delete user.");
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-base-content/70 mt-1">Manage registered users</p>
          </div>

          <button className="btn btn-error" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {message && <div className="alert alert-success mb-4">{message}</div>}

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {/* Edit user form */}
        {editingUser && (
          <div className="card bg-base-100 shadow mb-6">
            <div className="card-body">
              <h2 className="card-title">Edit User</h2>

              <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="input input-bordered w-full"
                    value={editForm.name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    value={editForm.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    <span className="loading loading-spinner" />
                    <span className="ml-2">Loading users...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || user.id}>
                    <th>{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
