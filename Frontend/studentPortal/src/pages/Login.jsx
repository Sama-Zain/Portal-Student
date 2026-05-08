import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../services/authservice";

const schema = z.object({
  identifier: z.string().min(3, "Required"),
  password: z.string().min(4, "Required"),
});

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  // 🔥 auto redirect
  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      navigate(decoded.role === 0 ? "/admin/dashboard" : "/student/dashboard");
    }
  }, [token]);

  // 🔥 submit
  const onSubmit = async (data) => {
    try {
      const payload = {
        userName: data.identifier,
        password: data.password,
      };

      const res = await loginApi(payload);

      // backend structure: res.data.data.accessToken
      const accessToken = res.data.data.accessToken;

      login({
        token: accessToken,
      });

      const decoded = JSON.parse(atob(accessToken.split(".")[1]));
      const role = decoded.role;

      toast.success("Login successful");

      navigate(role === 0 ? "/admin/dashboard" : "/student/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      toast.error(err?.message || "Server error");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface">

      {/* LEFT */}
      <section className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-l from-[#4b41e1] to-[#645efb]">
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold">Elevate Your Academic Journey</h2>
          <p className="mt-2">Welcome to your intellectual sanctuary</p>
        </div>
      </section>

      {/* RIGHT */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-24">

        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-10">

          <h1 className="text-3xl font-bold text-center text-indigo-600">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">

            {/* username */}
            <input
              {...register("identifier")}
              placeholder="Username"
              className="w-full p-4 border rounded-xl"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm">{errors.identifier.message}</p>
            )}

            {/* password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full p-4 border rounded-xl"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-indigo-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            {/* submit */}
            <button
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>

          </form>
        </div>
      </section>
    </main>
  );
}