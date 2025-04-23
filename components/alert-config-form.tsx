"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AlertConfigFormProps {
  onCancel: () => void
}

export function AlertConfigForm({ onCancel }: AlertConfigFormProps) {
  const [alertType, setAlertType] = useState("")
  const [threshold, setThreshold] = useState("")
  const [timeframe, setTimeframe] = useState("1h")
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyWebhook, setNotifyWebhook] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the alert configuration to an API
    console.log({
      alertType,
      threshold,
      timeframe,
      notifyEmail,
      notifyWebhook,
      webhookUrl,
    })

    onCancel() // Close the form after submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="alert-type">Alert Type</Label>
          <Select value={alertType} onValueChange={setAlertType} required>
            <SelectTrigger id="alert-type" className="border-primary/20 focus:ring-primary">
              <SelectValue placeholder="Select alert type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whale-transaction">Whale Transaction</SelectItem>
              <SelectItem value="token-price">Token Price Change</SelectItem>
              <SelectItem value="liquidity-change">Liquidity Pool Change</SelectItem>
              <SelectItem value="wallet-activity">Specific Wallet Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="threshold">Threshold</Label>
          <Input
            id="threshold"
            placeholder="e.g. 100000 SOL or 5%"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="border-primary/20 focus-visible:ring-primary"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger id="timeframe" className="border-primary/20 focus:ring-primary">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="24h">24 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Settings</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notification">Email Notification</Label>
            <p className="text-sm text-muted-foreground">Receive alerts via email</p>
          </div>
          <Switch id="email-notification" checked={notifyEmail} onCheckedChange={setNotifyEmail} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="webhook-notification">Webhook Notification</Label>
            <p className="text-sm text-muted-foreground">Send alerts to a webhook URL</p>
          </div>
          <Switch id="webhook-notification" checked={notifyWebhook} onCheckedChange={setNotifyWebhook} />
        </div>

        {notifyWebhook && (
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="border-primary/20 focus-visible:ring-primary"
              required={notifyWebhook}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          Create Alert
        </Button>
      </div>
    </form>
  )
}
