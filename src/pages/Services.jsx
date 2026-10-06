import { useEffect, useState } from "react";
import api from "../lib/api";

const emptyService = { title: "", description: "", iconName: "" };

export default function Services() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyService);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = () => {
    api.get("/api/services")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load services."))
      .finally(() => setLoading(false));
  };

  useEffect(loadItems, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await api.put(`/api/services/${editingId}`, form);
      } else {
        await api.post("/api/services", form);
      }
      setForm(emptyService);
      setEditingId(null);
      loadItems();
    } catch (err) {
      setError("Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title || "", description: item.description || "", iconName: item.iconName || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyService);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api.delete(`/api/services/${id}`);
      loadItems();
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Services</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 border rounded p-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required
               className="border rounded p-2" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
                   rows={3} className="border rounded p-2" />
        <input name="iconName" placeholder="Icon name (e.g. code, design, cloud)" value={form.iconName} onChange={handleChange}
               className="border rounded p-2" />
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-black text-white rounded p-2 disabled:opacity-50">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && <button type="button" onClick={cancelEdit} className="border rounded p-2">Cancel</button>}
        </div>
      </form>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="text-sm border rounded px-2 py-1">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-sm border rounded px-2 py-1 text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}