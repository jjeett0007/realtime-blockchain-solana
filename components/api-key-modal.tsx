"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink } from "lucide-react"

interface ApiKeyModalProps {
  open: boolean
  onSave: (apiKey: string) => void
}

// Default API key
const DEFAULT_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDM1MDkzMTI1MjgsImVtYWlsIjoiamplZXR0MDAwMDdAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzQzNTA5MzEyfQ.GjtrzJmSbzbEJTjOw-N6kn6_o_7IjRcsg99Xc3Svz_8"

export function ApiKeyModal({ open, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY)

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] border-primary/20 w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-text">Enter JET SCAN API Key</DialogTitle>
          <DialogDescription>You need a JET SCAN PRO API key to use this monitoring dashboard.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="col-span-4">
              API Key
            </Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your JET SCAN API key"
              className="col-span-4 border-primary/20 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <a
              href="https://public-api.solscan.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary"
            >
              Get a JET SCAN API key
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={() => onSave(apiKey)} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
