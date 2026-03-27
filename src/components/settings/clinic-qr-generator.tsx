"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Printer, Download, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ClinicQrGenerator({ clinicId }: { clinicId: string }) {
    const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/public/register/${clinicId}` : ""
    const qrRef = useRef<SVGSVGElement>(null)

    const handlePrint = () => {
        const svg = qrRef.current
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("context-2d" as any) // Note: this isn't strictly necessary for a simple print but good for reliable sizing. 
        // Actually, for pure printing, opening a window with the SVG is cleaner.
        
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Intake QR</title>
                        <style>
                            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                            .container { text-align: center; border: 2px dashed #ccc; padding: 40px; border-radius: 20px; }
                            h1 { color: #111827; margin-bottom: 10px; }
                            p { color: #6b7280; margin-bottom: 30px; font-size: 18px; }
                            svg { width: 300px; height: 300px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Scan to Register</h1>
                            <p>Point your phone's camera at this code to quickly fill out your intake form.</p>
                            ${svgData}
                        </div>
                        <script>
                            window.onload = () => { window.print(); window.close(); }
                        </script>
                    </body>
                </html>
            `)
            printWindow.document.close()
        }
    }

    const handleDownload = () => {
        const svg = qrRef.current
        if (!svg) return
        
        const svgData = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement("a")
        link.href = url
        link.download = `clinic-intake-qr-${clinicId.slice(0, 6)}.svg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(qrUrl)
        // ideally use a toast here
    }

    return (
        <Card className="border-cyan-100 bg-cyan-50/30 overflow-hidden relative">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
                <CardTitle className="text-cyan-900">Patient Intake QR Code</CardTitle>
                <CardDescription className="text-cyan-700/70">
                    Print this QR code and place it at your reception desk. Patients can scan it to securely fill out their details on their own phones, saving your staff time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-8 bg-white p-6 rounded-[24px] border border-cyan-100 shadow-sm">
                    
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
                        {qrUrl && (
                            <QRCodeSVG 
                                value={qrUrl} 
                                size={180} 
                                level="H"
                                includeMargin={true}
                                ref={qrRef}
                                imageSettings={{
                                    src: "/pmslogo.png",
                                    x: undefined,
                                    y: undefined,
                                    height: 30,
                                    width: 30,
                                    excavate: true,
                                }}
                            />
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Direct Link</p>
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 px-3">
                                <span className="text-sm font-medium text-gray-600 truncate flex-1">{qrUrl}</span>
                                <Button size="sm" variant="ghost" className="h-8 px-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50" onClick={handleCopyLink}>
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white shadow-md rounded-xl h-11" onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                Print QR
                            </Button>
                            <Button variant="outline" className="flex-1 border-cyan-200 text-cyan-700 hover:bg-cyan-50 rounded-xl h-11" onClick={handleDownload}>
                                <Download className="w-4 h-4 mr-2" />
                                Download SVG
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
