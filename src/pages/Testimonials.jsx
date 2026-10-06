import { useEffect, useState } from "react";
import api from "../lib/api";

const emptyTestimonial = { authorName: "", authorRole: "", authorPhotoUrl: "", message: "" };

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyTestimonial);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = () => {
    api.get("/api/testimonials")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load testimonials."))
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
        await api.put(`/api/testimonials/${editingId}`, form);
      } else {
        await api.post("/api/testimonials", form);
      }
      setForm(emptyTestimonial);
      setEditingId(null);
      loadItems();
    } catch (err) {
      setError("Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      authorName: item.authorName || "", authorRole: item.authorRole || "",
      authorPhotoUrl: item.authorPhotoUrl || "", message: item.message || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyTestimonial);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await api.delete(`/api/testimonials/${id}`);
      loadItems();
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Testimonials</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 border rounded p-4">
        <input name="authorName" placeholder="Author name" value={form.authorName} onChange={handleChange} required
               className="border rounded p-2" />
        <input name="authorRole" placeholder="Author role (e.g. CTO at X)" value={form.authorRole} onChange={handleChange}
               className="border rounded p-2" />
        <input name="authorPhotoUrl" placeholder="Author photo URL" value={form.authorPhotoUrl} onChange={handleChange}
               className="border rounded p-2" />
        <textarea name="message" placeholder="Testimonial message" value={form.message} onChange={handleChange} required
                   rows={3} className="border rounded p-2" />
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
          <li key={item.id} className="border rounded p-3 flex justify-between items-start">
            <div>
              <p className="font-semibold">{item.authorName}</p>
              <p className="text-sm text-gray-500">{item.authorRole}</p>
              <p className="text-sm mt-1">{item.message}</p>
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