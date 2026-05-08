import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axios from "axios";

// ── Validation schema ──────────────────────────────────────────────────────
const schema = z.object({
  firstName:     z.string().min(2, "Required"),
  lastName:      z.string().min(2, "Required"),
  academicLevel: z.string().min(1, "Required"),
  dateOfBirth:   z.string().min(1, "Required"),
  email:         z.string().email("Invalid email"),
  phone:         z.string().min(6, "Required"),
});

const inputDisabled = "w-full px-5 py-3 rounded-full border-none outline-none font-body text-[15px] bg-[#EEEDF4] text-gray-500 cursor-not-allowed";
const inputEnabled  = "w-full px-5 py-3 rounded-full border-none outline-none font-body text-[15px] bg-[#E8E6F0] text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:bg-[#dddaf0] transition-all";

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-600 pl-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs pl-2">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/profile", {
          headers: { token: localStorage.getItem("token") }
        });
        
        const userData = res.data.user;
        setProfile(userData);
        reset({
          firstName: userData.firstName,
          lastName: userData.lastName,
          academicLevel: userData.academicLevel || "Level 4",
          dateOfBirth: userData.dateOfBirth?.split('T')[0] || "", 
          email: userData.email,
          phone: userData.phone || "",
        });
      } catch {
        // Fixed: Removed unused 'err' to clear ESLint warning
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put("http://localhost:3000/user/update-profile", data, {
        headers: { token: localStorage.getItem("token") }
      });
      setProfile((prev) => ({ ...prev, ...res.data.user }));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      // Fixed: Removed unused 'err' to clear ESLint warning
      toast.error("Update failed. Please try again.");
    }
  };

  const handleCancel = () => {
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      academicLevel: profile.academicLevel,
      dateOfBirth: profile.dateOfBirth?.split('T')[0],
      email: profile.email,
      phone: profile.phone,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div className="bg-[#EEEDF4] rounded-2xl h-80" />
        </div>
        <div className="w-full lg:w-2/3 bg-[#EEEDF4] rounded-2xl h-96" />
      </div>
    );
  }

  const creditsProgress = profile ? Math.round(((profile.creditsEarned || 0) / (profile.creditsTotal || 120)) * 100) : 0;
  const displayName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <section className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-100 shadow-xl">
              {avatarPreview || profile.avatar ? (
                <img src={avatarPreview || profile.avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                // Fixed: Updated to bg-linear-to-br for Tailwind v4
                <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                  {profile.firstName?.[0]}
                </div>
              )}
            </div>
            <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <h2 className="font-headline text-2xl font-bold text-gray-800 mb-1">{displayName}</h2>
          <p className="text-indigo-600 font-medium mb-1">{profile.major || "Computer Science"}</p>
          <p className="text-gray-400 text-sm mb-6">Helwan University</p>

          <button
            onClick={() => setIsEditing(true)}
            // Fixed: Updated to bg-linear-to-r for Tailwind v4
            className="w-full text-white py-3 rounded-full font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-lg"
          >
            Edit Profile
          </button>
        </section>

        <section className="bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-indigo-600">school</span>
            <h3 className="font-headline text-lg font-bold text-gray-800">Academic Standing</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                {profile.status || "Active"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Cumulative GPA</span>
              <span className="text-xl font-bold text-gray-800">{(profile.gpa || 0).toFixed(2)}</span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">Credits Earned</span>
                <span className="text-gray-800">{profile.creditsEarned || 0} / {profile.creditsTotal || 120}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-700" 
                  style={{ width: `${creditsProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="font-headline text-2xl font-bold text-gray-800 mb-2">Personal Information</h3>
              <p className="text-gray-400 text-sm">Keep your university records up to date.</p>
            </div>
            <span className="material-symbols-outlined text-4xl text-indigo-100">badge</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="First Name" error={errors.firstName?.message}>
                <input {...register("firstName")} disabled={!isEditing} className={isEditing ? inputEnabled : inputDisabled} />
              </Field>
              <Field label="Last Name" error={errors.lastName?.message}>
                <input {...register("lastName")} disabled={!isEditing} className={isEditing ? inputEnabled : inputDisabled} />
              </Field>
              <Field label="Student ID">
                <input value={profile.studentId || "N/A"} disabled readOnly className={inputDisabled} />
              </Field>
              <Field label="Academic Level" error={errors.academicLevel?.message}>
                <input {...register("academicLevel")} disabled={!isEditing} className={isEditing ? inputEnabled : inputDisabled} />
              </Field>
              <Field label="Date of Birth" error={errors.dateOfBirth?.message}>
                <input type="date" {...register("dateOfBirth")} disabled={!isEditing} className={isEditing ? inputEnabled : inputDisabled} />
              </Field>
              <Field label="Email Address" error={errors.email?.message}>
                <input type="email" {...register("email")} disabled={!isEditing} className={isEditing ? inputEnabled : inputDisabled} />
              </Field>
              <Field label="Phone Number" error={errors.phone?.message}>
                <input type="tel" {...register("phone")} disabled={!isEditing} className={isEditing ? inputEnabled : inputDisabled} />
              </Field>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-2">
                <button type="submit" disabled={isSubmitting} className="flex-1 text-white py-3 rounded-full font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={handleCancel} className="flex-1 py-3 rounded-full font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}