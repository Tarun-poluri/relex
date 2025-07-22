// app/public/layout.tsx
"use client";
import RouteGuard from '@/components/RouteGuard'
import { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
        <div>
          {children}
        </div>
    </RouteGuard>
  )
}
