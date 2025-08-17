"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import UserLoginForm from "../../components/auth/UserLoginForm";
import UserSignupForm from "../../components/auth/UserSignupForm";
import Loading from "@/components/loading";

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (loading || isRedirecting) {
    return (
      <Loading
        text={isRedirecting ? "Redirecting..." : "Logging in..."}
        className="flex items-center justify-center min-h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen theme-bg flex-row-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLoginMode
                ? "Sign in to your account to continue"
                : "Join us and start your journey"}
            </CardDescription>
          </CardHeader>

          {/* Tab Navigation */}
          <div className="px-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("user")}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === "user"
                    ? "border-b-2 border-amber-600 text-amber-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setActiveTab("doctor")}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === "doctor"
                    ? "border-b-2 border-amber-600 text-amber-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          <CardContent className="pt-6">
            {activeTab === "user" ? (
              <>
                {isLoginMode ? (
                  <UserLoginForm
                    onToggleMode={() => setIsLoginMode(false)}
                    setPageLoading={setLoading}
                    setRedirecting={setIsRedirecting}
                  />
                ) : (
                  <UserSignupForm onToggleMode={() => setIsLoginMode(true)} />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex justify-center items-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600">
                  Doctor portal is currently under development. Please check
                  back later!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-amber-600 hover:text-amber-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-amber-600 hover:text-amber-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
