"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import SimpleReactValidator from "simple-react-validator"
import { Headphones, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { LOGIN_CREDENTIALS } from "@/data/login-details"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { login } from "@/store/actions/authActions"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [formError, setFormError] = useState("")
  const [, forceUpdate] = useState(0)

  const validator = useRef(new SimpleReactValidator({ autoForceUpdate: { forceUpdate } }))
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (validator.current.allValid()) {
      try {
        const result = await dispatch(login({ email, password, rememberMe }));

        if (result.success) {
          router.push("/dashboard");
        } else {
          setFormError(result.error || "Invalid email or password. Please try again.");
        }
      } catch (err) {
        setFormError("An unexpected error occurred. Please try again.");
      }
    } else {
      validator.current.showMessages()
      forceUpdate((prev) => prev + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 -z-10" />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white shadow-lg p-8">
            <div className="flex flex-col items-center space-y-2 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">RelaxFlow Admin</h1>
              <p className="text-sm text-muted-foreground text-center">
                Sign in to access your admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="admin@relaxflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="text-sm text-red-500">
                  {validator.current.message("email", email, "required|email")}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <a
                    href="#"
                    className="text-xs text-purple-600 hover:text-purple-800"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("Forgot password clicked")
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-sm text-red-500">
                  {validator.current.message("password", password, "required|min:6")}
                </div>
              </div>

              <div className="flex flex-row items-center space-x-2">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={() => setRememberMe(!rememberMe)}
                />
                <label className="text-sm font-normal">Remember me</label>
              </div>

              {(formError || error) && <p className="text-sm text-red-500 text-center">{formError || error}</p>}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>© 2024 RelaxFlow. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
