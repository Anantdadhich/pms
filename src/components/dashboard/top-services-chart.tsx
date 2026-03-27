"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface TopServicesChartProps {
    data: Array<{
        name: string
        revenue: number
        count: number
    }>
}

export function TopServicesChart({ data }: TopServicesChartProps) {
    return (
        <Card className="lg:col-span-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Top Services</CardTitle>
                        <CardDescription>Most revenue-generating treatments</CardDescription>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
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
                            cursor={{ fill: '#f3f4f6' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-4 shadow-xl">
                                            <div className="font-semibold text-gray-900 mb-2">{payload[0].payload.name}</div>
                                            <div className="text-[13px] text-gray-600 flex justify-between gap-4">
                                                <span>Revenue:</span>
                                                <span className="font-medium text-gray-900">{formatCurrency(payload[0].value as number)}</span>
                                            </div>
                                            <div className="text-[13px] text-gray-600 flex justify-between gap-4 mt-1">
                                                <span>Count:</span>
                                                <span className="font-medium text-gray-900">{payload[0].payload.count} treatments</span>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="#0ea5e9"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
