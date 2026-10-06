import {useEffect, useState} from "react";
import api  from "../lib/api";

const emptySkill = { name: "", category: "", level: 50 };

export default function Skills(){
   const [skills, setSkills]=useState([]);
   const [error, setError]=useState(null);
   const [loading, setLoading]=useState(true);
   const [form ,setForm]=useState(emptySkill);
   const [saving, setSaving]=useState(false);
   const [editingId,setEditingId]=useState(null);

   const loadSkills=()=>{
       api.get("/api/skills")
       .then((res)=>setSkills(res.data))
       .catch(()=>setError("Failed to load skills,"))
           .finally(()=>setLoading(false));
           };

       useEffect(()=>{
           loadSkills();
       },[]);

   const handleChange=(e)=>{
     //  setSkills({...skills, [e.target.name]: e.target.value});
     const {name,value}=e.target;
        setForm({ ...form, [name]: name === "level" ? Number(value) : value });
   }

   const handleSubmit=async(e)=>{
       e.preventDefault();
       setSaving(true);
       setError(null);

       try{
           if(editingId){
               await api.put(`/api/skills/${editingId}`, form);
           }else{
               await api.post("/api/skills", form);
           }
       setForm(emptySkill);
       setEditingId(null);
       loadSkills();
    }
catch(err){
    setError("Failed to save skill.");
    }
finally{
    setSaving(false);
    }
};

const startEdit=(skill)=>{
    setEditingId(skill.id);
    setForm({name:skill.name,category:skill.category,level:skill.level});
    };

const cancelEdit=()=>{
    setEditingId(null);
    setForm(emptySkill);
    };

const handleDelete = async(id)=>{
    if(!window.confirm("Are you sure you want to delete this skill?")) return;
    try{
        await api.delete(`/api/skills/${id}`);
        loadSkills();
    }catch(err){
        setError("Failed to delete skill.");
    }
};


if (loading) return <p>Loading...</p>;

return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Skills</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 items-end">
        <div>
          <label className="block text-sm">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required
                 className="border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Category</label>
          <input name="category" value={form.category} onChange={handleChange}
                 className="border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Level (0-100)</label>
          <input type="number" name="level" value={form.level} onChange={handleChange}
                 min="0" max="100" className="border rounded p-2 w-24" />
        </div>
        <button type="submit" disabled={saving} className="bg-black text-white rounded p-2 disabled:opacity-50">
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} className="border rounded p-2">
            Cancel
          </button>
        )}
      </form>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <ul className="flex flex-col gap-2">
        {skills.map((skill) => (
          <li key={skill.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{skill.name}</p>
              <p className="text-sm text-gray-500">{skill.category} — {skill.level}%</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(skill)} className="text-sm border rounded px-2 py-1">
                Edit
              </button>
              <button onClick={() => handleDelete(skill.id)} className="text-sm border rounded px-2 py-1 text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}