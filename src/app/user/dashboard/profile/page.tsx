"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, IndianRupee, Palette, Shield, Download, Edit3 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { title } from "process";
import { ur } from "zod/v4/locales";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function ModernProfilePage() {
  const { setTheme } = useTheme()

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    createdAt: '',
    updatedAt: '',
    totalSpent: 0,
    totalExpenses: 0,
    categoriesUsed: 0,
    lastExpense: {
      category: "",
      title: "",
      note: "",
      amount: "",
      createdAt:""
    }
  });



  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  useEffect(() => {

    const fetchData = async () => {
      try {

        const response = await axios.get(`http://localhost:8080/api/user/profile/stats`, { withCredentials: true })
        console.log(response.data)
        setUserInfo(response.data);
      } catch (error) {
        console.log("Something went wrong while fetching the user data!!")
      }
    }
    fetchData();
  }, [])

  // update profile!!
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name,
        email: userInfo.email,
        password: ""
      });
    }
  }, [userInfo]);

  const handleUpdateProfile = async () => {
    try {
      const payload: any = {}
      if (formData.name && formData.name.trim() !== "") {
        payload.name = formData.name
      }
      if (formData.email && formData.email.trim() !== "") {
        payload.email = formData.email
      }
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password
      }
      const response = await axios.put(
        "http://localhost:8080/api/user/update",
        payload,
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Profile updated successfully!", {
          style: {
            "backgroundColor": "#D5F5E3",
            "color": "black",
            "border": "none"
          },
          duration: 1500
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      setIsEditing(false); // exit edit mode after successful save
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  // Mock user stats (replace with real data)
  const userStats = {
    totalSpent: 15420,
    thisMonth: 3240,
    budgetUsed: 85,
    totalExpenses: 156
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold ">My Profile</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white">
                  <AvatarFallback className="text-2xl bg-white text-gray-800">
                    {userInfo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {userInfo.email}
                </p>
                <p className="text-blue-100 flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  Member since {userInfo.createdAt}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Premium Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Spent</p>
                  <p className="text-2xl font-bold">₹{userInfo.totalSpent}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">This Month</p>
                  <p className="text-2xl font-bold">₹{userStats.thisMonth.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Budget Used</p>
                  <p className="text-2xl font-bold">{userStats.budgetUsed}%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                  <div className="text-purple-600 font-bold text-sm">{userStats.budgetUsed}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Expenses</p>
                  <p className="text-2xl font-bold">{userInfo.totalExpenses}</p>
                </div>
                <User className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Section */}
        <div className="">

          {/* Personal Information */}
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className='text-1xl'>Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    value={formData.email}
                    disabled={true}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className='text-1xl'>Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={formData.name}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        handleUpdateProfile(); // if currently editing, save changes
                      } else {
                        setIsEditing(true);    // enter edit mode
                      }
                    }}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="password" className='text-1xl'>Update Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type='password'
                    value={formData.password}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isEditing}
                  >
                    Change
                  </Button>
                </div>
              </div>

              <Separator />

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleUpdateProfile}
                disabled={!isEditing}
              >
                Update Profile
              </Button>

            </CardContent>
          </Card>

          {/* Preferences & Security */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preferences & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-500">Use dark theme across the app</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Currency</Label>
                <select className="w-full p-2 border rounded-md">
                  <option value="INR">🇮🇳 Indian Rupee (₹)</option>
                  <option value="USD">🇺🇸 US Dollar ($)</option>
                  <option value="EUR">🇪🇺 Euro (€)</option>
                </select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => { }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3  rounded-lg">
                <div>
                  <p className="font-medium">Added expense: {userInfo.lastExpense.title}</p>
                  <p className="text-sm text-gray-500">{userInfo.lastExpense.createdAt}</p>
                </div>
                <Badge>₹{userInfo.lastExpense.amount}</Badge>
              </div>

              {/* <div className="flex justify-between items-center p-3 rounded-lg">
                <div>
                  <p className="font-medium">Budget updated: Food</p>
                  <p className="text-sm text-gray-500">Yesterday, 10:15 AM</p>
                </div>
                <Badge variant="secondary">₹5,000</Badge>
              </div> */}

              <div className="flex justify-between items-center p-3  rounded-lg">
                <div>
                  <p className="font-medium">Profile updated</p>
                  <p className="text-sm text-gray-500">{userInfo.updatedAt}</p>
                </div>
                <Badge variant="outline">Updated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}