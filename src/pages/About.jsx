import {useEffect , useState} from "react";
import api from "../lib/api";

const emptyAbout={
      name: "", headline: "", bio: "", profileImageUrl: "",
      email: "", location: "", resumeUrl: "", githubUrl: "", linkedinUrl: "",
    };

export default function About(){
    const [form ,setForm]=useState(emptyAbout);
    const [loading, setLoading]=useState(true);
    const[saving ,setSaving]=useState(false);
    const[status, setStatus]=useState(null);
    const [uploading, setUploading] = useState(false);


    useEffect(()=>{
        api.get("api/about")
          .then((res)=>setForm(res.data))
              .catch((err)=>{
                   if(err.response?.status!==404){
                       setStatus("error-load");
                   }
               })
               .finally(()=>setLoading(false));
                },[]);


    const handleChange=(e)=>{
        setForm({...form, [e.target.name]: e.target.value});
        } ;

    const handleSubmit = async (e) => {
       e.preventDefault();
       setSaving(true);
       setStatus(null);
       try {
         const res = await api.put("/api/about", form);
         setForm(res.data);
         setStatus("success");
       } catch (err) {
         setStatus("error-save");
       } finally {
         setSaving(false);
       }
     };


     const handleImageUpload = async (e) => {
       const file = e.target.files[0];
       if (!file) return;
       setUploading(true);
       try {
         const data = new FormData();
         data.append("file", file); // must match @RequestParam("file") on the backend
         const res = await api.post("/api/upload/image", data);
         setForm((prev) => ({ ...prev, profileImageUrl: res.data.url }));
       } catch (err) {
         setStatus("error-save");
       } finally {
         setUploading(false);
       }
     };


  if (loading) return <p>Loading...</p>;

    const fields = [
      ["name", "Name"], ["headline", "Headline"], ["email", "Email"],
      ["location", "Location"], ["profileImageUrl", "Profile Image URL"],
      ["resumeUrl", "Resume URL"], ["githubUrl", "GitHub URL"], ["linkedinUrl", "LinkedIn URL"],
    ];

return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {fields.map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={form[name] || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
        ))}


         <div>
           <label className="block text-sm font-medium mb-1">Profile Image</label>
           <input type="file" accept="image/*" onChange={handleImageUpload} />
           {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
           {form.profileImageUrl && (
             <img src={form.profileImageUrl} alt="Preview"
                  className="mt-2 w-24 h-24 rounded-full object-cover" />
           )}
         </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            rows={5}
            className="border rounded p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white rounded p-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {status === "success" && <p className="text-green-600">Saved!</p>}
        {status === "error-save" && <p className="text-red-500">Failed to save.</p>}
        {status === "error-load" && <p className="text-red-500">Failed to load existing data.</p>}
      </form>
    </div>
  );

}