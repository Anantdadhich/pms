"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Calendar } from "lucide-react"

interface MonthlyComparisonChartProps {
    data: Array<{
        month: string
        thisYear: number
        lastYear: number
    }>
    currentYear?: number
}

export function MonthlyComparisonChart({ data, currentYear = new Date().getFullYear() }: MonthlyComparisonChartProps) {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Monthly Comparison</CardTitle>
                        <CardDescription>This year vs last year</CardDescription>
                    </div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="month"
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                                            <div className="font-semibold mb-2">{payload[0].payload.month}</div>
                                            {payload.map((entry) => (
                                                <div key={entry.name} className="text-sm" style={{ color: entry.color }}>
                                                    {entry.name}: {formatCurrency(entry.value as number)}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="thisYear"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            name={`${currentYear}`}
                            dot={{ fill: "hsl(var(--primary))" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="lastYear"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name={`${currentYear - 1}`}
                            dot={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
