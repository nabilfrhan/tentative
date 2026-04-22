"use client"

import { ArrowLeft, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTentativeStore } from "@/lib/store"
import { DayCard } from "./day-card"
import type { Tentative } from "@/lib/types"

interface TentativeEditorProps {
  tentative: Tentative
  onBack: () => void
}

export function TentativeEditor({ tentative, onBack }: TentativeEditorProps) {
  const { updateTentative, addDay } = useTentativeStore()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 space-y-1">
              <Input
                type="text"
                value={tentative.title}
                onChange={(e) => updateTentative(tentative.id, { title: e.target.value })}
                className="h-auto border-0 bg-transparent p-0 text-2xl font-bold shadow-none focus-visible:ring-0"
                placeholder="Trip Title"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <Input
                  type="text"
                  value={tentative.dateRange}
                  onChange={(e) => updateTentative(tentative.id, { dateRange: e.target.value })}
                  className="h-auto w-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                  placeholder="e.g., 27/6 - 1/7"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-6">
          {tentative.days.map((day) => (
            <DayCard key={day.id} tentativeId={tentative.id} day={day} />
          ))}

          <Button
            variant="outline"
            size="lg"
            className="w-full border-dashed"
            onClick={() => addDay(tentative.id, "")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Day {tentative.days.length + 1}
          </Button>
        </div>
      </main>
    </div>
  )
}
