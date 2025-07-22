// app/private/layout.tsx
"use client";

import RouteGuard from '@/components/RouteGuard'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <div className="flex">
        {children}
      </div>
    </RouteGuard>
  )
}
