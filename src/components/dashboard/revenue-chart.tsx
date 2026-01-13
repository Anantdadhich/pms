"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface RevenueChartProps {
    weeklyData: { name: string; value: number }[]
    monthlyData: { name: string; value: number }[]
}

export function RevenueChart({ weeklyData, monthlyData }: RevenueChartProps) {
    const [period, setPeriod] = useState<"weekly" | "monthly">("monthly")
    const data = period === "weekly" ? weeklyData : monthlyData
    const maxValue = Math.max(...data.map(d => d.value), 100)

    return (
        <Card className="col-span-full lg:col-span-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            {period === "weekly" ? "Last 8 weeks" : "Last 6 months"}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
                    {data.map((item, i) => {
                        const heightPercentage = Math.round((item.value / maxValue) * 100)
                        return (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="relative w-full flex items-end justify-center h-full bg-muted/20 rounded-t-sm overflow-hidden">
                                    {/* Bar */}
                                    <div
                                        className="w-full mx-1 bg-primary/90 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-primary"
                                        style={{ height: `${heightPercentage}%` }}
                                    >
                                        {/* Tooltip on hover */}
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-md transition-opacity whitespace-nowrap border z-10 pointer-events-none">
                                            {formatCurrency(item.value)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
