
import prisma from "@/lib/prisma"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"

export async function getDashboardStats(clinicId: string) {
    const startOfCurrentMonth = startOfMonth(new Date())
    const endOfCurrentMonth = endOfMonth(new Date())
    const startOfLastMonth = startOfMonth(subMonths(new Date(), 1))
    const endOfLastMonth = endOfMonth(subMonths(new Date(), 1))

    const totalPatients = await prisma.patient.count({
        where: { clinicId },
    })

    // 2. Today's Appointments
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const appointmentsToday = await prisma.appointment.count({
        where: {
            clinicId,
            scheduledAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    })

    const appointmentsCompletedToday = await prisma.appointment.count({
        where: {
            clinicId,
            status: "COMPLETED",
            scheduledAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    })



    // 3. Total Revenue (All Time)
    const totalRevenue = await prisma.payment.aggregate({
        where: {
            invoice: { clinicId },
        },
        _sum: { amount: true },
    })

    const currentMonthRevenue = await prisma.payment.aggregate({
        where: {
            invoice: { clinicId },
            paidAt: {
                gte: startOfCurrentMonth,
                lte: endOfCurrentMonth,
            },
        },
        _sum: { amount: true },
    })

    const lastMonthRevenue = await prisma.payment.aggregate({
        where: {
            invoice: { clinicId },
            paidAt: {
                gte: startOfLastMonth,
                lte: endOfLastMonth,
            },
        },
        _sum: { amount: true },
    })

    // Decimal handling
    const totalRevenueValue = totalRevenue

        ._sum.amount ? Number(totalRevenue._sum.amount) : 0
    const revenueValue = currentMonthRevenue._sum.amount ? Number(currentMonthRevenue._sum.amount) : 0
    const lastRevenueValue = lastMonthRevenue._sum.amount ? Number(lastMonthRevenue._sum.amount) : 0
    const revenueChange = lastRevenueValue === 0 ? 100 : ((revenueValue - lastRevenueValue) / lastRevenueValue) * 100

    // 4. Invoices Pending count
    const pendingInvoices = await prisma.invoice.count({
        where: {
            clinicId,
            status: { in: ["PENDING", "PARTIAL"] }
        }
    })


    return [
        {
            title: "Total Patients",
            value: totalPatients.toString(),
            change: "Total registered",
            trend: "neutral",
            description: "Active patients",
        },
        {
            title: "Today's Appointments",
            value: appointmentsToday.toString(),
            change: `${appointmentsCompletedToday} completed`,
            trend: appointmentsCompletedToday > 0 ? "up" : "neutral",
            description: "Scheduled today",
        },
        {
            title: "Total Revenue",
            value: totalRevenueValue,
            isCurrency: true,
            change: `${revenueChange > 0 ? "+" : ""}${Math.round(revenueChange)}%`,
            trend: revenueChange > 0 ? "up" : revenueChange < 0 ? "down" : "neutral",
            description: "vs last month",
        },
        {
            title: "Pending Invoices",
            value: pendingInvoices.toString(),
            change: "Awaiting payment",
            trend: "neutral",
            description: "Outstanding",
        },
    ]
}

export async function getUpcomingAppointments(clinicId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const appointments = await prisma.appointment.findMany({
        where: {
            clinicId,
            scheduledAt: {
                gte: today,
            },
            status: {
                in: ["SCHEDULED", "CONFIRMED", "SEATED"]
            }
        },
        include: {
            patient: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            },
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        },
        orderBy: {
            scheduledAt: "asc"
        },
        take: 5
    })

    return appointments
}

export async function getRecentActivity(clinicId: string) {
    // Recent appointments
    const recentAppointments = await prisma.appointment.findMany({
        where: {
            clinicId,
            status: "COMPLETED",
        },
        include: {
            patient: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        },
        orderBy: {
            updatedAt: "desc"
        },
        take: 5
    })

    return recentAppointments.map(apt => ({
        id: apt.id,
        patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
        treatment: apt.type,
        action: "completed",
        time: apt.updatedAt.toISOString()
    }))
}

export async function getRevenueChartData(clinicId: string) {
    const today = new Date()
    const months = []

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        months.push({
            label: d.toLocaleString('default', { month: 'short' }),
            start: startOfMonth(d),
            end: endOfMonth(d)
        })
    }

    const data = await Promise.all(months.map(async (m) => {
        const result = await prisma.payment.aggregate({
            where: {
                invoice: { clinicId },
                paidAt: {
                    gte: m.start,
                    lte: m.end
                }
            },
            _sum: { amount: true }
        })

        return {
            name: m.label,
            value: result._sum.amount ? Number(result._sum.amount) : 0
        }
    }))

    return data
}

export async function getRevenueChartDataWeekly(clinicId: string) {
    const today = new Date()
    const weeks = []

    // Last 8 weeks
    for (let i = 7; i >= 0; i--) {
        const weekEnd = new Date(today)
        weekEnd.setDate(today.getDate() - (i * 7))
        weekEnd.setHours(23, 59, 59, 999)

        const weekStart = new Date(weekEnd)
        weekStart.setDate(weekEnd.getDate() - 6)
        weekStart.setHours(0, 0, 0, 0)

        weeks.push({
            label: `W${8 - i}`,
            start: weekStart,
            end: weekEnd
        })
    }

    const data = await Promise.all(weeks.map(async (w) => {
        const result = await prisma.payment.aggregate({
            where: {
                invoice: { clinicId },
                paidAt: {
                    gte: w.start,
                    lte: w.end
                }
            },
            _sum: { amount: true }
        })

        return {
            name: w.label,
            value: result._sum.amount ? Number(result._sum.amount) : 0
        }
    }))

    return data
}

export async function getAppointmentStatusDistribution(clinicId: string) {
    const statusCounts = await prisma.appointment.groupBy({
        by: ['status'],
        where: { clinicId },
        _count: { status: true }
    })

    return statusCounts.map(item => ({
        name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
        value: item._count.status,
        color:
            item.status === 'COMPLETED' ? 'bg-emerald-500' :
                item.status === 'SCHEDULED' ? 'bg-blue-500' :
                    item.status === 'CANCELLED' ? 'bg-red-500' :
                        'bg-gray-500'
    }))
}

export async function getPatientGrowthData(clinicId: string) {
    const today = new Date()
    const months = []

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        months.push({
            label: d.toLocaleString('default', { month: 'short' }),
            start: startOfMonth(d),
            end: endOfMonth(d)
        })
    }

    const data = await Promise.all(months.map(async (m) => {
        const count = await prisma.patient.count({
            where: {
                clinicId,
                createdAt: {
                    gte: m.start,
                    lte: m.end
                }
            }
        })
        return {
            name: m.label,
            value: count
        }
    }))

    return data
}

export async function getPatientGrowthDataWeekly(clinicId: string) {
    const today = new Date()
    const weeks = []

    // Last 8 weeks
    for (let i = 7; i >= 0; i--) {
        const weekEnd = new Date(today)
        weekEnd.setDate(today.getDate() - (i * 7))
        weekEnd.setHours(23, 59, 59, 999)

        const weekStart = new Date(weekEnd)
        weekStart.setDate(weekEnd.getDate() - 6)
        weekStart.setHours(0, 0, 0, 0)

        weeks.push({
            label: `W${8 - i}`,
            start: weekStart,
            end: weekEnd
        })
    }

    const data = await Promise.all(weeks.map(async (w) => {
        const count = await prisma.patient.count({
            where: {
                clinicId,
                createdAt: {
                    gte: w.start,
                    lte: w.end
                }
            }
        })
        return {
            name: w.label,
            value: count
        }
    }))

    return data
}

// Top Services by Revenue
export async function getTopServicesData(clinicId: string) {
    const topServices = await prisma.invoiceItem.groupBy({
        by: ['description'],
        where: {
            invoice: { clinicId }
        },
        _sum: {
            total: true
        },
        _count: {
            id: true
        },
        orderBy: {
            _sum: {
                total: 'desc'
            }
        },
        take: 5
    })

    return topServices.map(service => ({
        name: service.description.length > 20 ? service.description.substring(0, 20) + '...' : service.description,
        revenue: Number(service._sum.total || 0),
        count: service._count.id
    }))
}

// Monthly Revenue Comparison (This Year vs Last Year)
export async function getMonthlyComparisonData(clinicId: string) {
    const currentYear = new Date().getFullYear()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const chartData = []

    for (let i = 0; i < 12; i++) {
        const thisYearStart = new Date(currentYear, i, 1)
        const thisYearEnd = new Date(currentYear, i + 1, 1)
        const lastYearStart = new Date(currentYear - 1, i, 1)
        const lastYearEnd = new Date(currentYear - 1, i + 1, 1)

        const thisYearRevenue = await prisma.payment.aggregate({
            where: {
                invoice: { clinicId },
                paidAt: {
                    gte: thisYearStart,
                    lt: thisYearEnd
                }
            },
            _sum: { amount: true }
        })

        const lastYearRevenue = await prisma.payment.aggregate({
            where: {
                invoice: { clinicId },
                paidAt: {
                    gte: lastYearStart,
                    lt: lastYearEnd
                }
            },
            _sum: { amount: true }
        })

        chartData.push({
            month: months[i],
            thisYear: Number(thisYearRevenue._sum.amount || 0),
            lastYear: Number(lastYearRevenue._sum.amount || 0)
        })
    }

    return chartData
}
