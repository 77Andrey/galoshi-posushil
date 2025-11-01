"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Keyboard } from "lucide-react"

export function KeyboardShortcutsDialog() {
  const shortcuts = [
    { keys: ["?"], description: "Show keyboard shortcuts" },
    { keys: ["S"], description: "Open scenarios dialog" },
    { keys: ["E"], description: "Open export dialog" },
    { keys: ["R"], description: "Focus on routes table search" },
    { keys: ["Esc"], description: "Close dialogs / Clear selection" },
    { keys: ["1-6"], description: "Select metric card" },
    { keys: ["←", "→"], description: "Navigate between tabs" },
    { keys: ["/", "Ctrl", "K"], description: "Quick search" },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="w-4 h-4" />
          <span className="hidden md:inline">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Use these shortcuts to navigate faster</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {shortcuts.map((shortcut, idx) => (
            <Card key={idx} className="p-3 flex items-center justify-between hover:bg-accent/5 transition-colors">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIdx) => (
                  <kbd
                    key={keyIdx}
                    className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">?</kbd>{" "}
          anytime to view shortcuts
        </div>
      </DialogContent>
    </Dialog>
  )
}
