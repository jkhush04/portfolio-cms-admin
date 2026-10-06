import { useEffect, useState } from "react";
import api from "../lib/api";

const emptyBlog = { title: "", content: "", coverImageUrl: "", tags: "" };

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyBlog);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadBlogs = () => {
    api.get("/api/blogs")
      .then((res) => setBlogs(res.data))
      .catch(() => setError("Failed to load blogs."))
      .finally(() => setLoading(false));
  };

  useEffect(loadBlogs, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await api.put(`/api/blogs/${editingId}`, payload);
      } else {
        await api.post("/api/blogs", payload);
      }
      setForm(emptyBlog);
      setEditingId(null);
      loadBlogs();
    } catch (err) {
      setError("Failed to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (blog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title || "",
      content: blog.content || "",
      coverImageUrl: blog.coverImageUrl || "",
      tags: (blog.tags || []).join(", "),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyBlog);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      loadBlogs();
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Blog</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 border rounded p-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required
               className="border rounded p-2" />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required
                   rows={6} className="border rounded p-2" />
        <input name="coverImageUrl" placeholder="Cover image URL" value={form.coverImageUrl} onChange={handleChange}
               className="border rounded p-2" />
        <input name="tags" placeholder="Tags (comma-separated, e.g. java, spring-boot)"
               value={form.tags} onChange={handleChange} className="border rounded p-2" />
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-black text-white rounded p-2 disabled:opacity-50">
            {editingId ? "Update" : "Publish"}
          </button>
          {editingId && <button type="button" onClick={cancelEdit} className="border rounded p-2">Cancel</button>}
        </div>
      </form>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <ul className="flex flex-col gap-2">
        {blogs.map((blog) => (
          <li key={blog.id} className="border rounded p-3 flex justify-between items-start">
            <div>
              <p className="font-semibold">{blog.title}</p>
              <p className="text-sm text-gray-500">
                {blog.createdAt && new Date(blog.createdAt).toLocaleDateString()} — {(blog.tags || []).join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(blog)} className="text-sm border rounded px-2 py-1">Edit</button>
              <button onClick={() => handleDelete(blog.id)} className="text-sm border rounded px-2 py-1 text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}