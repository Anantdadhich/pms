"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"

interface PatientGrowthChartProps {
    weeklyData: { name: string; value: number }[]
    monthlyData: { name: string; value: number }[]
}

export function PatientGrowthChart({ weeklyData, monthlyData }: PatientGrowthChartProps) {
    const [period, setPeriod] = useState<"weekly" | "monthly">("monthly")
    const data = period === "weekly" ? weeklyData : monthlyData
    const maxValue = Math.max(...data.map(d => d.value), 10)

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Patient Growth</CardTitle>
                        <CardDescription>
                            New patients {period === "weekly" ? "per week" : "per month"}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Select value={period} onValueChange={(val) => setPeriod(val as "weekly" | "monthly")}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full flex items-end justify-between gap-1 pt-4">
                    {data.map((item, i) => {
                        const heightPercentage = Math.round((item.value / maxValue) * 100)
                        return (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="relative w-full flex items-end justify-center h-full bg-muted/20 rounded-t-sm overflow-hidden">
                                    <div
                                        className="w-full mx-0.5 bg-emerald-500/90 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-emerald-500"
                                        style={{ height: `${heightPercentage || 5}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-md transition-opacity whitespace-nowrap border z-10 pointer-events-none">
                                            {item.value} patients
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium truncate w-full text-center">
                                    {item.name}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
