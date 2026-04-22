"use client"

import { useState, useEffect } from "react"
import { useTentativeStore } from "@/lib/store"
import { TentativeList } from "./tentative-list"
import { TentativeEditor } from "./tentative-editor"
import type { Tentative } from "@/lib/types"

export function TentativeApp() {
  const [mounted, setMounted] = useState(false)
  const [selectedTentative, setSelectedTentative] = useState<Tentative | null>(null)
  const { tentatives, fetchTentatives, isLoading } = useTentativeStore()

  // Handle hydration and fetch data
  useEffect(() => {
    setMounted(true)
    fetchTentatives()
  }, [fetchTentatives])

  // Keep selected tentative in sync with store
  useEffect(() => {
    if (selectedTentative) {
      const updated = tentatives.find((t) => t.id === selectedTentative.id)
      if (updated) {
        setSelectedTentative(updated)
      }
    }
  }, [tentatives, selectedTentative])

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (selectedTentative) {
    return (
      <TentativeEditor
        tentative={selectedTentative}
        onBack={() => setSelectedTentative(null)}
      />
    )
  }

  return <TentativeList onSelect={setSelectedTentative} />
}
