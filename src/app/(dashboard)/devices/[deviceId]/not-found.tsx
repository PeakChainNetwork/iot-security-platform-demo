import Link from "next/link"

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Empty className="bg-card">
          <EmptyHeader>
            <EmptyTitle>Device not found</EmptyTitle>
            <EmptyDescription>
              This device ID doesn’t exist (or the backend couldn’t find it).
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/devices">Back to devices</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
