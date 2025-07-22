'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password']

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const getUserFromStorage = () => {
      const localUser = localStorage.getItem('user')
      const sessionUser = sessionStorage.getItem('user')
      return localUser || sessionUser
    }

    const user = getUserFromStorage()
    const isPublic = publicPaths.includes(pathname)
    const isAuthenticated = Boolean(user)

    if (!isAuthenticated && !isPublic) {
      router.push('/login')
    } else if (isAuthenticated && isPublic) {
      router.push('/dashboard')
    } else if (isAuthenticated && pathname === '/') {
      router.push('/dashboard')
    } else if (!isAuthenticated && pathname === '/') {
      router.push('/login')
    } else {
      setAuthorized(true)
    }
  }, [pathname, router])

  if (!authorized) {
    return null
  }

  return <>{children}</>
}
