import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={idx} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-44" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

