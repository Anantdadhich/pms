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
                            className="text-[12px]"
                            tick={{ fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: "#6b7280" }}
                            tickFormatter={(value) => formatCurrency(value)}
                            className="text-[12px]"
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-4 shadow-xl">
                                            <div className="font-semibold text-gray-900 mb-2">{payload[0].payload.month}</div>
                                            {payload.map((entry) => (
                                                <div key={entry.name} className="flex justify-between gap-6 text-[13px] font-medium" style={{ color: entry.color }}>
                                                    <span>{entry.name}:</span>
                                                    <span>{formatCurrency(entry.value as number)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "13px" }} />
                        <Line
                            type="monotone"
                            dataKey="thisYear"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            name={`${currentYear}`}
                            dot={{ fill: "#0ea5e9", r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 2, fill: "white" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="lastYear"
                            stroke="#94a3b8"
                            strokeWidth={3}
                            strokeDasharray="6 6"
                            name={`${currentYear - 1}`}
                            dot={{ fill: "#94a3b8", r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, stroke: "#94a3b8", strokeWidth: 2, fill: "white" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
