// Supabase Edge Function for sending booking confirmation emails
// This is like a robot mailman that sends emails for us!

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'hello@opscentral.com'
const BOOKINGS_NOTIFY = Deno.env.get('BOOKINGS_NOTIFY') || 'team@opscentral.com'

interface BookingEmailData {
  booking: {
    id: string
    fullName: string
    email: string
    notes: string
    timezoneSelected: string
    utcStart: string
    durationMinutes: number
    localStartTime?: string
    utcStartTime?: string
    painPoints: {
      workflowChallenge: string
      sopManagement: string
      mainGoal: string
      limitingTools: string
      demoPreparation: string
    }
    date: string
    time: string
    createdAt: string
    status: string
  }
  icsContent: string
}

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const data: BookingEmailData = await req.json()
    const { booking, icsContent } = data

    // Format times for email
    const localStartTime = booking.localStartTime
      ? new Date(booking.localStartTime)
      : new Date(`${booking.date}T${booking.time}:00`)
    const utcStartTime = booking.utcStartTime
      ? new Date(booking.utcStartTime)
      : new Date(booking.utcStart)

    const formattedDate = localStartTime.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
    })

    const formattedTime = localStartTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const formattedUtcTime = utcStartTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const subject = `Your OpsCentral booking is confirmed – ${formattedDate} at ${formattedTime}`

    // Customer email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d9488;">Your OpsCentral Demo is Confirmed!</h2>
        
        <p>Hi ${booking.fullName},</p>
        
        <p>Thank you for booking a demo with OpsCentral. We're excited to show you how our platform can transform your workflow management.</p>
        
        <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Booking Details</h3>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime} (${booking.timezoneSelected})</p>
          <p><strong>Equivalent in UTC:</strong> ${formattedUtcTime} UTC</p>
          <p><strong>Duration:</strong> ${booking.durationMinutes} minutes</p>
          <p><strong>Location:</strong> Online (link will be provided)</p>
        </div>
        
        ${
          booking.notes
            ? `
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Your Notes:</h4>
            <p>${booking.notes}</p>
          </div>
        `
            : ''
        }
        
        ${
          Object.values(booking.painPoints).some((value) => value.trim())
            ? `
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Your Responses:</h4>
            ${booking.painPoints.workflowChallenge ? `<p><strong>Workflow Challenge:</strong> ${booking.painPoints.workflowChallenge}</p>` : ''}
            ${booking.painPoints.sopManagement ? `<p><strong>SOP Management:</strong> ${booking.painPoints.sopManagement}</p>` : ''}
            ${booking.painPoints.mainGoal ? `<p><strong>Main Goal:</strong> ${booking.painPoints.mainGoal}</p>` : ''}
            ${booking.painPoints.limitingTools ? `<p><strong>Limiting Tools:</strong> ${booking.painPoints.limitingTools}</p>` : ''}
            ${booking.painPoints.demoPreparation ? `<p><strong>Demo Preparation:</strong> ${booking.painPoints.demoPreparation}</p>` : ''}
          </div>
        `
            : ''
        }
        
        <p>We'll send you the meeting link shortly before your scheduled time. If you need to reschedule or have any questions, please reply to this email.</p>
        
        <p>Looking forward to speaking with you!</p>
        
        <p>Best regards,<br>The OpsCentral Team</p>
      </div>
    `

    // Internal team email content
    const internalEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d9488;">New OpsCentral Demo Booking</h2>
        
        <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Booking Details</h3>
          <p><strong>Name:</strong> ${booking.fullName}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime} (${booking.timezoneSelected})</p>
          <p><strong>Equivalent in UTC:</strong> ${formattedUtcTime} UTC</p>
          <p><strong>Duration:</strong> ${booking.durationMinutes} minutes</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        
        ${
          booking.notes
            ? `
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Customer Notes:</h4>
            <p>${booking.notes}</p>
          </div>
        `
            : ''
        }
        
        ${
          Object.values(booking.painPoints).some((value) => value.trim())
            ? `
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Pain Points & Responses:</h4>
            ${booking.painPoints.workflowChallenge ? `<p><strong>Workflow Challenge:</strong> ${booking.painPoints.workflowChallenge}</p>` : ''}
            ${booking.painPoints.sopManagement ? `<p><strong>SOP Management:</strong> ${booking.painPoints.sopManagement}</p>` : ''}
            ${booking.painPoints.mainGoal ? `<p><strong>Main Goal:</strong> ${booking.painPoints.mainGoal}</p>` : ''}
            ${booking.painPoints.limitingTools ? `<p><strong>Limiting Tools:</strong> ${booking.painPoints.limitingTools}</p>` : ''}
            ${booking.painPoints.demoPreparation ? `<p><strong>Demo Preparation:</strong> ${booking.painPoints.demoPreparation}</p>` : ''}
          </div>
        `
            : ''
        }
      </div>
    `

    // Send customer email via Resend
    const customerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: booking.email,
        subject: subject,
        html: emailContent,
        attachments: [
          {
            filename: 'booking.ics',
            content: btoa(icsContent),
          },
        ],
      }),
    })

    // Send internal team notification
    const teamEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: BOOKINGS_NOTIFY,
        subject: `New Demo Booking - ${booking.fullName} - ${formattedDate} at ${formattedTime} (${booking.timezoneSelected})`,
        html: internalEmailContent,
      }),
    })

    if (!customerEmailResponse.ok || !teamEmailResponse.ok) {
      throw new Error('Failed to send emails')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error sending emails:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})

