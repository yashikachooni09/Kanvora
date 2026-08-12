import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ApiClient from "../../api/apiClient";

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    // Try to get user info from localStorage first for instant load
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData({
          fname: user.fname || "",
          lname: user.lname || "",
          email: user.email || "",
          avatar: user.avatar || "",
        });
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await ApiClient.get("/auth/me");
      if (res.success) {
        setFormData({
          fname: res.data.fname || "",
          lname: res.data.lname || "",
          email: res.data.email || "",
          avatar: res.data.avatar || "",
        });
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await ApiClient.put("/auth/me", formData);
      if (res.success) {
        toast.success("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(res.data));
        window.dispatchEvent(new Event("storage")); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-8 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
        
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-4">Edit Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-indigo-500 bg-slate-700 flex items-center justify-center">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl text-slate-400 font-bold">
                      {formData.fname ? formData.fname[0].toUpperCase() : "U"}
                    </span>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  Change
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-2">Click to upload avatar (Max 2MB)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                  placeholder="John"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium transition transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[150px]"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
