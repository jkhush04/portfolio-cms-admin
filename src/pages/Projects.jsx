import { useEffect, useState } from "react";
import api from "../lib/api";

const emptyProject = {
  title: "", description: "", techStack: "", githubUrl: "", liveUrl: "", imageUrl: "", featured: false,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadProjects = () => {
    api.get("/api/projects")
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  };

  useEffect(loadProjects, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (editingId) {
        await api.put(`/api/projects/${editingId}`, payload);
      } else {
        await api.post("/api/projects", payload);
      }
      setForm(emptyProject);
      setEditingId(null);
      loadProjects();
    } catch (err) {
      setError("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      // array -> comma-separated string, the reverse conversion, for editing
      techStack: (project.techStack || []).join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      imageUrl: project.imageUrl || "",
      featured: !!project.featured,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProject);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      loadProjects();
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 border rounded p-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required
               className="border rounded p-2" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
                   rows={3} className="border rounded p-2" />
        <input name="techStack" placeholder="Tech stack (comma-separated, e.g. React, Spring Boot, MongoDB)"
               value={form.techStack} onChange={handleChange} className="border rounded p-2" />
        <input name="githubUrl" placeholder="GitHub URL" value={form.githubUrl} onChange={handleChange}
               className="border rounded p-2" />
        <input name="liveUrl" placeholder="Live URL" value={form.liveUrl} onChange={handleChange}
               className="border rounded p-2" />
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange}
               className="border rounded p-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Featured (show on homepage)
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-black text-white rounded p-2 disabled:opacity-50">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="border rounded p-2">Cancel</button>
          )}
        </div>
      </form>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.id} className="border rounded p-3 flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {project.title} {project.featured && <span className="text-xs text-blue-600">★ Featured</span>}
              </p>
              <p className="text-sm text-gray-500">{(project.techStack || []).join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(project)} className="text-sm border rounded px-2 py-1">Edit</button>
              <button onClick={() => handleDelete(project.id)} className="text-sm border rounded px-2 py-1 text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}