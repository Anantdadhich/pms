// Environment variables for BulkSMS
const TOKEN_ID = process.env.BULKSMS_TOKEN_ID
const TOKEN_SECRET = process.env.BULKSMS_TOKEN_SECRET

interface SendSMSParams {
    to: string
    body: string
}

export async function sendSMS({ to, body }: SendSMSParams): Promise<{ success: boolean; messageId?: string; error?: any }> {
    // 1. Mock Mode (Default if no credentials)
    if (!TOKEN_ID || !TOKEN_SECRET) {
        console.log("----------------------------------------")
        console.log("📢 [MOCK SMS - BULKSMS] To:", to)
        console.log("📝 Message:", body)
        console.log("----------------------------------------")
        return { success: true, messageId: `mock_${Date.now()}` }
    }

    // 2. Real Mode (BulkSMS.com JSON API)
    try {
        const tokenId = TOKEN_ID.trim()
        const tokenSecret = TOKEN_SECRET.trim()

        const response = await fetch("https://api.bulksms.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Ensure no accidental whitespace in env vars
                "Authorization": `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64')}`
            },
            body: JSON.stringify({
                to,
                body,
                encoding: "TEXT"
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("❌ BulkSMS Error:", data)
            return { success: false, error: data }
        }

        // BulkSMS returns an array of submissions, we take the first one
        const submission = data[0]
        return { success: true, messageId: submission.id }

    } catch (error) {
        console.error("❌ BulkSMS Network Error:", error)
        return { success: false, error }
    }
}
