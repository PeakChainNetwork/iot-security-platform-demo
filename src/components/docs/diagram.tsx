"use client"

import * as React from "react"
import { ExpandIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function DiagramCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full justify-center overflow-x-auto">
      <div className="w-full min-w-0 max-w-4xl">{children}</div>
    </div>
  )
}

export function Diagram({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="leading-snug">{title}</CardTitle>
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <ExpandIcon />
                Expand
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border bg-muted/20 p-4 sm:p-6">
                <DiagramCanvas>{children}</DiagramCanvas>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border bg-muted/20 p-4 sm:p-6">
          <DiagramCanvas>{children}</DiagramCanvas>
        </div>
      </CardContent>
    </Card>
  )
}
