"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

interface UserLoginFormProps {
  onToggleMode: () => void;
  setPageLoading: (loading: boolean) => void;
  setRedirecting: (isRedirecting: boolean) => void;
}

export default function UserLoginForm({
  onToggleMode,
  setPageLoading,
  setRedirecting,
}: UserLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { setUser, setError, setLoading, setMessage } = useSession();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { email, password } = formData;

    setPageLoading(true);
    axiosInstance
      .post("/auth/login", {
        email,
        password,
      })
      .then(async (response) => {
        setPageLoading(false);
        const { token, ...user } = response.data.data;
        if (user) {
          setRedirecting?.(true);
          setUser(user);
          setLoading(false);
          setMessage(response.data.message);
          setError(null);
          router.replace("/dashboard");
        }

        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
      })
      .catch((error) => {
        console.error(error);
        setPageLoading(false);
      });

    console.log("Login:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-border-class ${
              errors.email && "border-red-500"
            } `}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className={`input-border-class ${
              errors.password && "border-red-500"
            } `}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Remember + Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-amber-600 hover:text-amber-500">
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button type="submit" className="w-full button-class py-3 px-4">
        Sign In
      </button>

      {/* Toggle to Signup */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggleMode}
          className="text-amber-600 hover:text-amber-500 font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
