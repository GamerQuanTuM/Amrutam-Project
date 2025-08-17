"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TabsContent } from "./ui/tabs";
import { Activity, Heart, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";

const QuickActions = () => {
  const router = useRouter();
  return (
    <TabsContent value="quick-actions" className="space-y-4">
      <h2 className="text-xl font-semibold text-amber-900 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-900">
              <Stethoscope className="w-5 h-5 mr-2" />
              Book New Appointment
            </CardTitle>
            <CardDescription className="text-amber-700">
              Find and book appointments with specialists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => router.push("/find-doctors")}
              className="button-class w-full px-4 py-2"
            >
              Find Doctors
            </button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-900">
              <Activity className="w-5 h-5 mr-2" />
              Health Records
            </CardTitle>
            <CardDescription className="text-amber-700">
              View your medical history and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button className="button-outline-class w-full px-4 py-2">
              View Records
            </button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-900">
              <Heart className="w-5 h-5 mr-2" />
              Health Profile
            </CardTitle>
            <CardDescription className="text-amber-700">
              Update your health information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button className="button-outline-class w-full px-4 py-2">
              Update Profile
            </button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-900">
              <User className="w-5 h-5 mr-2" />
              Account Settings
            </CardTitle>
            <CardDescription className="text-amber-700">
              Manage your account preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button className="button-outline-class w-full px-4 py-2">
              Settings
            </button>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default QuickActions;
