"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { AppSidebar } from "../../../components/app-sidebar"
import { DashboardHeader } from "../../../components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Lock, Camera, Loader2 } from "lucide-react"
import SimpleReactValidator from "simple-react-validator"
import { useAppSelector } from "@/store/hooks"

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio?: string;
  location?: string;
}

interface SecurityFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isSecurityLoading, setIsSecurityLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [, forceUpdate] = useState(0)

  const loggedInUser = useAppSelector((state) => state.auth.user);

  const profileValidator = useRef(new SimpleReactValidator({
    autoForceUpdate: { forceUpdate },
    messages: {
      required: 'This field is required.',
      min: 'Must be at least :min characters.',
      email: 'Must be a valid email.',
      phone: 'Must be a valid phone number (min 10 digits).',
      max: 'Must be less than :max characters.',
      alpha_num_dash_space: 'Can only contain letters, numbers, dashes, and spaces.',
    }
  }));

  const securityValidator = useRef(new SimpleReactValidator({
    autoForceUpdate: { forceUpdate },
    messages: {
      required: 'This field is required.',
      min: 'Must be at least :min characters.',
      passwordMatch: 'Passwords do not match.',
    },
    validators: {
      passwordMatch: {
        rule: (val) => {
          const newPasswordValue = securityForm.getValues('newPassword');
          return val === newPasswordValue;
        },
        message: 'Passwords do not match.'
      }
    }
  }));


  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: loggedInUser?.email || "",
      phone: "",
      bio: "",
      location: "",
    },
  })

  const securityForm = useForm<SecurityFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    let userEmailFromStorage = '';
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          userEmailFromStorage = parsedUser.email;
        }
      }
    } catch (e) {
    }

    const emailToSet = loggedInUser?.email || userEmailFromStorage;

    if (emailToSet) {
      profileForm.reset({
        ...profileForm.getValues(),
        email: emailToSet,
      });
    }
  }, [loggedInUser?.email, profileForm]);


  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (profileValidator.current.allValid()) {
      setIsProfileLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Profile updated:", data)
      } catch (error) {
        console.error("Profile update error:", error)
      } finally {
        setIsProfileLoading(false)
      }
    } else {
      profileValidator.current.showMessages();
      forceUpdate((prev) => prev + 1);
    }
  }

  const onSecuritySubmit = async (data: SecurityFormValues) => {
    if (securityValidator.current.allValid()) {
      setIsSecurityLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Password updated:", data)
        securityForm.reset()
      } catch (error) {
        console.error("Password update error:", error)
      } finally {
        setIsSecurityLoading(false)
      }
    } else {
      securityValidator.current.showMessages();
      forceUpdate((prev) => prev + 1);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader searchQuery="" onSearchChange={() => {}} />
        <main className="flex-1 space-y-6 p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            </div>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Your account information and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-user.jpg" alt="Admin User" />
                      <AvatarFallback className="text-lg">
                        {loggedInUser?.email ? loggedInUser.email.substring(0, 2).toUpperCase() : "AU"}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{loggedInUser?.email ? loggedInUser.email.split('@')[0] : "Admin User"}</h3>
                    <p className="text-sm text-muted-foreground">{loggedInUser?.email || "admin@relaxflow.com"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Role</span>
                    <Badge variant="destructive">Administrator</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined January 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Last login: Today at 2:30 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter first name" {...field} />
                              </FormControl>
                              <div className="text-sm text-red-500">
                                {profileValidator.current.message("firstName", field.value, "required|min:2")}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                              </FormControl>
                              <div className="text-sm text-red-500">
                                {profileValidator.current.message("lastName", field.value, "required|min:2")}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input placeholder="Enter email" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <div className="text-sm text-red-500">
                                {profileValidator.current.message("email", field.value, "required|email")}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input placeholder="Enter phone number" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <div className="text-sm text-red-500">
                                {profileValidator.current.message("phone", field.value, "required|min:10")}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Enter location" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <div className="text-sm text-red-500">
                                {profileValidator.current.message("location", field.value, "alpha_num_dash_space")}
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us about yourself..." className="min-h-[100px]" {...field} />
                            </FormControl>
                            <div className="text-sm text-red-500">
                                {profileValidator.current.message("bio", field.value, "max:500")}
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isProfileLoading}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          {isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="Enter current password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <div className="text-sm text-red-500">
                                {securityValidator.current.message("currentPassword", field.value, "required|min:6")}
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={securityForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter new password" {...field} />
                              </FormControl>
                              <div className="text-sm text-red-500">
                                {securityValidator.current.message("newPassword", field.value, "required|min:6")}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={securityForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm new password" {...field} />
                              </FormControl>
                              <div className="text-sm text-red-500">
                                {securityValidator.current.message("confirmPassword", field.value, `required|min:6|passwordMatch`)}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSecurityLoading} variant="outline">
                          {isSecurityLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </Form>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Enable 2FA</div>
                        <div className="text-xs text-muted-foreground">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <div className="text-sm font-medium">Email Notifications</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Receive notifications via email</div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <div className="text-sm font-medium">Push Notifications</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Receive push notifications in your browser</div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
