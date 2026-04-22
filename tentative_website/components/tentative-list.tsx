"use client"

import { useState } from "react"
import { Plus, MapPin, Calendar, Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTentativeStore } from "@/lib/store"
import type { Tentative } from "@/lib/types"

interface TentativeListProps {
  onSelect: (tentative: Tentative) => void
}

export function TentativeList({ onSelect }: TentativeListProps) {
  const { tentatives, createTentative, deleteTentative } = useTentativeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (title.trim() && !isCreating) {
      setIsCreating(true)
      const newTentative = await createTentative(title.trim(), dateRange.trim())
      setTitle("")
      setDateRange("")
      setIsOpen(false)
      setIsCreating(false)
      if (newTentative) {
        onSelect(newTentative)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tentative</h1>
              <p className="mt-1 text-muted-foreground">Plan your trips with ease</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  New Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Tentative</DialogTitle>
                  <DialogDescription>
                    Start planning your next adventure
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Trip Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Langkawi Trip 2024"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Input
                      id="dateRange"
                      placeholder="e.g., 27/6 - 1/7"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={!title.trim() || isCreating}>
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {tentatives.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No trips planned yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Create your first tentative to start planning your adventure
              </p>
              <Button className="mt-6 gap-2" onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tentatives.map((tentative) => (
              <Card
                key={tentative.id}
                className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                onClick={() => onSelect(tentative)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tentative.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {tentative.dateRange && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {tentative.dateRange}
                          </span>
                        )}
                        <span>{tentative.days.length} day{tentative.days.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTentative(tentative.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
