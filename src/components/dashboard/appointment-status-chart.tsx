"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface StatusData {
    name: string
    value: number
    color: string
}

interface AppointmentStatusChartProps {
    data: StatusData[]
}

export function AppointmentStatusChart({ data }: AppointmentStatusChartProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1

    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
                <CardDescription>Distribution of all appointments</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.name} className="space-y-1.5 border border-gray-100/50 p-3 rounded-xl bg-gray-50/30">
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="font-semibold text-gray-800">{item.name}</span>
                                <span className="text-gray-500 font-medium">
                                    {item.value} ({Math.round((item.value / total) * 100)}%)
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden shadow-inner">
                                <div
                                    className={`h-full ${item.color} shadow-sm`}
                                    style={{ width: `${(item.value / total) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            No appointments data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
