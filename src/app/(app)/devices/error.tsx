"use client"

import * as React from "react"

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Empty className="bg-card">
          <EmptyHeader>
            <EmptyTitle>Couldn’t load devices</EmptyTitle>
            <EmptyDescription className="max-w-xl">
              {error.message || "Something went wrong while requesting the device list."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={reset}>Try again</Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
