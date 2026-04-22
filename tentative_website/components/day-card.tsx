"use client"

import { Plus, Trash2, GripVertical, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTentativeStore } from "@/lib/store"
import type { Day, ThemeColor } from "@/lib/types"

interface DayCardProps {
  tentativeId: string
  day: Day
}

export function DayCard({ tentativeId, day }: DayCardProps) {
  const { addItem, updateItem, removeItem, removeDay } = useTentativeStore()

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {day.dayNumber}
            </span>
            Day {day.dayNumber}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeDay(tentativeId, day.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <div className="grid grid-cols-[auto_100px_1fr_1fr_auto] gap-0 bg-muted/50 text-sm font-medium text-muted-foreground">
            <div className="p-3 border-r border-border/50 w-10"></div>
            <div className="p-3 border-r border-border/50">Time</div>
            <div className="p-3 border-r border-border/50">Location</div>
            <div className="p-3 border-r border-border/50">Notes</div>
            <div className="p-3 w-10"></div>
          </div>
          {day.items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[auto_100px_1fr_1fr_auto] gap-0 border-t border-border/50 group hover:bg-muted/30 transition-colors"
            >
              <div className="p-2 border-r border-border/50 flex items-center justify-center text-muted-foreground/50 w-10">
                <GripVertical className="h-4 w-4" />
              </div>
              <div className="p-2 border-r border-border/50">
                <Input
                  type="text"
                  placeholder="7:00 AM"
                  value={item.time}
                  onChange={(e) => updateItem(tentativeId, day.id, item.id, { time: e.target.value })}
                  className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
                />
              </div>
              <div className="p-2 border-r border-border/50">
                <Input
                  type="text"
                  placeholder="Enter location..."
                  value={item.location}
                  onChange={(e) => updateItem(tentativeId, day.id, item.id, { location: e.target.value })}
                  className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
                />
              </div>
              <div className="p-2 border-r border-border/50">
                <Input
                  type="text"
                  placeholder="Add notes..."
                  value={item.notes}
                  onChange={(e) => updateItem(tentativeId, day.id, item.id, { notes: e.target.value })}
                  className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
                />
              </div>
              <div className="p-2 flex items-center justify-center w-10">
                {day.items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    onClick={() => removeItem(tentativeId, day.id, item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full border border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
          onClick={() => addItem(tentativeId, day.id)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </CardContent>
    </Card>
  )
}
