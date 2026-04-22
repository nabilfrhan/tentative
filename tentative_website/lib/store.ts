"use client"

import { create } from "zustand"
import type { Tentative, Day, ItineraryItem } from "./types"

interface TentativeStore {
  tentatives: Tentative[]
  currentTentative: Tentative | null
  isLoading: boolean
  setTentatives: (tentatives: Tentative[]) => void
  setCurrentTentative: (tentative: Tentative | null) => void
  setLoading: (loading: boolean) => void
  fetchTentatives: () => Promise<void>
  createTentative: (title: string, dateRange: string) => Promise<Tentative | null>
  updateTentative: (id: string, updates: Partial<Tentative>) => Promise<void>
  deleteTentative: (id: string) => Promise<void>
  addDay: (tentativeId: string, date: string) => Promise<void>
  removeDay: (tentativeId: string, dayId: string) => Promise<void>
  addItem: (tentativeId: string, dayId: string) => Promise<void>
  updateItem: (tentativeId: string, dayId: string, itemId: string, updates: Partial<ItineraryItem>) => Promise<void>
  removeItem: (tentativeId: string, dayId: string, itemId: string) => Promise<void>
}

export const useTentativeStore = create<TentativeStore>()((set, get) => ({
  tentatives: [],
  currentTentative: null,
  isLoading: false,

  setTentatives: (tentatives) => set({ tentatives }),
  setCurrentTentative: (tentative) => set({ currentTentative: tentative }),
  setLoading: (loading) => set({ isLoading: loading }),

  fetchTentatives: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch("/api/tentatives")
      if (res.ok) {
        const data = await res.json()
        set({ tentatives: data })
      }
    } catch (error) {
      console.error("Failed to fetch tentatives:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  createTentative: async (title, dateRange) => {
    try {
      const res = await fetch("/api/tentatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dateRange }),
      })
      if (res.ok) {
        const newTentative = await res.json()
        set((state) => ({
          tentatives: [newTentative, ...state.tentatives],
          currentTentative: newTentative,
        }))
        return newTentative
      }
    } catch (error) {
      console.error("Failed to create tentative:", error)
    }
    return null
  },

  updateTentative: async (id, updates) => {
    try {
      await fetch(`/api/tentatives/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      set((state) => ({
        tentatives: state.tentatives.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        currentTentative: state.currentTentative?.id === id ? { ...state.currentTentative, ...updates } : state.currentTentative,
      }))
    } catch (error) {
      console.error("Failed to update tentative:", error)
    }
  },

  deleteTentative: async (id) => {
    try {
      await fetch(`/api/tentatives/${id}`, { method: "DELETE" })
      set((state) => ({
        tentatives: state.tentatives.filter((t) => t.id !== id),
        currentTentative: state.currentTentative?.id === id ? null : state.currentTentative,
      }))
    } catch (error) {
      console.error("Failed to delete tentative:", error)
    }
  },

  addDay: async (tentativeId, date) => {
    const tentative = get().tentatives.find((t) => t.id === tentativeId)
    if (!tentative) return

    try {
      const res = await fetch("/api/days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tentativeId,
          dayNumber: tentative.days.length + 1,
          date,
        }),
      })
      if (res.ok) {
        const newDay = await res.json()
        const updatedTentative = {
          ...tentative,
          days: [...tentative.days, newDay],
        }
        set((state) => ({
          tentatives: state.tentatives.map((t) => (t.id === tentativeId ? updatedTentative : t)),
          currentTentative: state.currentTentative?.id === tentativeId ? updatedTentative : state.currentTentative,
        }))
      }
    } catch (error) {
      console.error("Failed to add day:", error)
    }
  },

  removeDay: async (tentativeId, dayId) => {
    try {
      await fetch(`/api/days/${dayId}`, { method: "DELETE" })
      const tentative = get().tentatives.find((t) => t.id === tentativeId)
      if (!tentative) return

      const updatedDays = tentative.days
        .filter((d) => d.id !== dayId)
        .map((d, index) => ({ ...d, dayNumber: index + 1 }))

      const updatedTentative = { ...tentative, days: updatedDays }

      set((state) => ({
        tentatives: state.tentatives.map((t) => (t.id === tentativeId ? updatedTentative : t)),
        currentTentative: state.currentTentative?.id === tentativeId ? updatedTentative : state.currentTentative,
      }))
    } catch (error) {
      console.error("Failed to remove day:", error)
    }
  },

  addItem: async (tentativeId, dayId) => {
    const tentative = get().tentatives.find((t) => t.id === tentativeId)
    if (!tentative) return

    const day = tentative.days.find((d) => d.id === dayId)
    if (!day) return

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayId,
          sortOrder: day.items.length,
        }),
      })
      if (res.ok) {
        const newItem = await res.json()
        const updatedDays = tentative.days.map((d) => {
          if (d.id === dayId) {
            return { ...d, items: [...d.items, newItem] }
          }
          return d
        })
        const updatedTentative = { ...tentative, days: updatedDays }

        set((state) => ({
          tentatives: state.tentatives.map((t) => (t.id === tentativeId ? updatedTentative : t)),
          currentTentative: state.currentTentative?.id === tentativeId ? updatedTentative : state.currentTentative,
        }))
      }
    } catch (error) {
      console.error("Failed to add item:", error)
    }
  },

  updateItem: async (tentativeId, dayId, itemId, updates) => {
    // Optimistic update
    const tentative = get().tentatives.find((t) => t.id === tentativeId)
    if (!tentative) return

    const updatedDays = tentative.days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          items: day.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
        }
      }
      return day
    })

    const updatedTentative = { ...tentative, days: updatedDays }

    set((state) => ({
      tentatives: state.tentatives.map((t) => (t.id === tentativeId ? updatedTentative : t)),
      currentTentative: state.currentTentative?.id === tentativeId ? updatedTentative : state.currentTentative,
    }))

    // Save to database
    try {
      await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
    } catch (error) {
      console.error("Failed to update item:", error)
    }
  },

  removeItem: async (tentativeId, dayId, itemId) => {
    try {
      await fetch(`/api/items/${itemId}`, { method: "DELETE" })
      const tentative = get().tentatives.find((t) => t.id === tentativeId)
      if (!tentative) return

      const updatedDays = tentative.days.map((day) => {
        if (day.id === dayId) {
          return { ...day, items: day.items.filter((item) => item.id !== itemId) }
        }
        return day
      })

      const updatedTentative = { ...tentative, days: updatedDays }

      set((state) => ({
        tentatives: state.tentatives.map((t) => (t.id === tentativeId ? updatedTentative : t)),
        currentTentative: state.currentTentative?.id === tentativeId ? updatedTentative : state.currentTentative,
      }))
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  },
}))
