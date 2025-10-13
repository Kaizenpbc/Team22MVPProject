interface BookingEmailData {
  booking: {
    id: string;
    fullName: string;
    email: string;
    notes: string;
    timezoneSelected: string;
    utcStart: string;
    durationMinutes: number;
    localStartTime?: string;
    utcStartTime?: string;
    painPoints: {
      workflowChallenge: string;
      sopManagement: string;
      mainGoal: string;
      limitingTools: string;
      demoPreparation: string;
    };
    date: string;
    time: string;
    createdAt: string;
    status: string;
  };
  icsContent: string;
}

export const sendBookingConfirmation = async (data: BookingEmailData) => {
  const { booking, icsContent } = data;
  
  // Use local time for display
  const localStartTime = booking.localStartTime ? new Date(booking.localStartTime) : new Date(`${booking.date}T${booking.time}:00`);
  const utcStartTime = booking.utcStartTime ? new Date(booking.utcStartTime) : new Date(booking.utcStart);
  
  // Format date for email subject  
  const formattedDate = localStartTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'short'
  });
  
  const formattedTime = localStartTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedUtcTime = utcStartTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const subject = `Your Kovari booking is confirmed – ${formattedDate} at ${formattedTime}`;
  
  // Create email content
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0d9488;">Your Kovari Demo is Confirmed!</h2>
      
      <p>Hi ${booking.fullName},</p>
      
      <p>Thank you for booking a demo with Kovari. We're excited to show you how our platform can transform your workflow management.</p>
      
      <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0d9488; margin-top: 0;">Booking Details</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime} (${booking.timezoneSelected})</p>
        <p><strong>Equivalent in UTC:</strong> ${formattedUtcTime} UTC</p>
        <p><strong>Duration:</strong> ${booking.durationMinutes} minutes</p>
        <p><strong>Location:</strong> Online (link will be provided)</p>
      </div>
      
      ${booking.notes ? `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Your Notes:</h4>
          <p>${booking.notes}</p>
        </div>
      ` : ''}
      
      ${Object.values(booking.painPoints).some(value => value.trim()) ? `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Your Responses:</h4>
          ${booking.painPoints.workflowChallenge ? `<p><strong>Workflow Challenge:</strong> ${booking.painPoints.workflowChallenge}</p>` : ''}
          ${booking.painPoints.sopManagement ? `<p><strong>SOP Management:</strong> ${booking.painPoints.sopManagement}</p>` : ''}
          ${booking.painPoints.mainGoal ? `<p><strong>Main Goal:</strong> ${booking.painPoints.mainGoal}</p>` : ''}
          ${booking.painPoints.limitingTools ? `<p><strong>Limiting Tools:</strong> ${booking.painPoints.limitingTools}</p>` : ''}
          ${booking.painPoints.demoPreparation ? `<p><strong>Demo Preparation:</strong> ${booking.painPoints.demoPreparation}</p>` : ''}
        </div>
      ` : ''}
      
      <p>We'll send you the meeting link shortly before your scheduled time. If you need to reschedule or have any questions, please reply to this email.</p>
      
      <p>Looking forward to speaking with you!</p>
      
      <p>Best regards,<br>The Kovari Team</p>
    </div>
  `;

  // Internal team email content
  const internalEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0d9488;">New Kovari Demo Booking</h2>
      
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
      
      ${booking.notes ? `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Customer Notes:</h4>
          <p>${booking.notes}</p>
        </div>
      ` : ''}
      
      ${Object.values(booking.painPoints).some(value => value.trim()) ? `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">Pain Points & Responses:</h4>
          ${booking.painPoints.workflowChallenge ? `<p><strong>Workflow Challenge:</strong> ${booking.painPoints.workflowChallenge}</p>` : ''}
          ${booking.painPoints.sopManagement ? `<p><strong>SOP Management:</strong> ${booking.painPoints.sopManagement}</p>` : ''}
          ${booking.painPoints.mainGoal ? `<p><strong>Main Goal:</strong> ${booking.painPoints.mainGoal}</p>` : ''}
          ${booking.painPoints.limitingTools ? `<p><strong>Limiting Tools:</strong> ${booking.painPoints.limitingTools}</p>` : ''}
          ${booking.painPoints.demoPreparation ? `<p><strong>Demo Preparation:</strong> ${booking.painPoints.demoPreparation}</p>` : ''}
        </div>
      ` : ''}
    </div>
  `;

  // Console output for demonstration (since no live email service)
  console.log('=== BOOKING CONFIRMATION EMAIL ===');
  console.log('To:', booking.email);
  console.log('Subject:', subject);
  console.log('Content:', emailContent);
  console.log('\n=== INTERNAL TEAM EMAIL ===');
  console.log('To: team@opscentral.com');
  console.log('Subject:', `New Demo Booking - ${booking.fullName} - ${formattedDate} at ${formattedTime} (${booking.timezoneSelected})`);
  console.log('Content:', internalEmailContent);
  console.log('\n=== ICS CALENDAR ATTACHMENT ===');
  console.log(icsContent);
  console.log('================================');

  // In a real implementation, this would send actual emails
  // For now, we'll simulate success
  return Promise.resolve({ success: true });
};