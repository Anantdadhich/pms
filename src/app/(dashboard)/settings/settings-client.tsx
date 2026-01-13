"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateClinicSettings } from "@/lib/actions/settings"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface SettingsClientProps {
    clinicId: string
    initialSettings: {
        name: string
        email: string
        phone: string
        address: string
        timezone: string
        currency: string
        defaultAppointmentDuration: number
        invoicePrefix: string
    }
}

export function SettingsClient({ clinicId, initialSettings }: SettingsClientProps) {
    const [settings, setSettings] = useState(initialSettings)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateClinicSettings(clinicId, settings)
            toast({
                title: "Settings saved",
                description: "Your clinic settings have been updated successfully.",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save settings. Please try again.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Clinic Information</CardTitle>
                    <CardDescription>Basic information about your clinic (used in invoices and reports)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Clinic Name *</Label>
                            <Input
                                id="name"
                                value={settings.name}
                                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                placeholder="Smile Dental Clinic"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Clinic Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                placeholder="contact@smiledental.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Clinic Phone</Label>
                            <Input
                                id="phone"
                                value={settings.phone}
                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Clinic Address</Label>
                            <Input
                                id="address"
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                placeholder="123 Medical Drive, New Delhi, India"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>Configure timezone, currency and defaults</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select
                                value={settings.timezone}
                                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                                    <SelectItem value="America/New_York">USA - Eastern</SelectItem>
                                    <SelectItem value="America/Los_Angeles">USA - Pacific</SelectItem>
                                    <SelectItem value="Europe/London">UK (GMT)</SelectItem>
                                    <SelectItem value="Asia/Dubai">UAE (GST)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={settings.currency}
                                onValueChange={(value) => setSettings({ ...settings, currency: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                                    <SelectItem value="EUR">Euro (€)</SelectItem>
                                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                                    <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Default Appointment Duration</Label>
                            <Select
                                value={settings.defaultAppointmentDuration.toString()}
                                onValueChange={(value) => setSettings({ ...settings, defaultAppointmentDuration: parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="45">45 minutes</SelectItem>
                                    <SelectItem value="60">60 minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                            <Input
                                id="invoicePrefix"
                                value={settings.invoicePrefix}
                                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                                placeholder="INV"
                                maxLength={10}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Settings"}
                </Button>
            </div>
        </div>
    )
}
