// Booking Service - Handles all booking-related database operations
// This is like a helpful assistant that does all the booking work for us!

import { supabase } from '../lib/supabase'

export interface BookingData {
  fullName: string
  email: string
  notes: string
  painPoints: {
    workflowChallenge: string
    sopManagement: string
    mainGoal: string
    limitingTools: string
    demoPreparation: string
  }
  date: string
  time: string
  timezoneSelected: string
  utcStart: string
  durationMinutes: number
}

export interface Booking {
  id: string
  fullName: string
  email: string
  notes: string
  painPoints: {
    workflowChallenge: string
    sopManagement: string
    mainGoal: string
    limitingTools: string
    demoPreparation: string
  }
  date: string
  time: string
  timezoneSelected: string
  utcStart: string
  durationMinutes: number
  createdAt: string
  status: string
}

/**
 * Check if a time slot is available (no collision)
 */
export async function checkSlotAvailability(
  utcStart: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_booking_collision', {
      check_utc_start: utcStart,
    })

    if (error) {
      console.error('Error checking slot availability:', error)
      return false
    }

    // Function returns true if there IS a collision, so we invert it
    return !data
  } catch (error) {
    console.error('Error checking slot availability:', error)
    return false
  }
}

/**
 * Get all bookings for collision detection
 */
export async function getBookingsForDate(date: string): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('selected_date', date)
      .eq('status', 'confirmed')

    if (error) {
      console.error('Error fetching bookings:', error)
      return []
    }

    return (
      data?.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        notes: row.notes || '',
        painPoints: {
          workflowChallenge: row.workflow_challenge || '',
          sopManagement: row.sop_management || '',
          mainGoal: row.main_goal || '',
          limitingTools: row.limiting_tools || '',
          demoPreparation: row.demo_preparation || '',
        },
        date: row.selected_date,
        time: row.selected_time,
        timezoneSelected: row.timezone_selected,
        utcStart: row.utc_start,
        durationMinutes: row.duration_minutes,
        createdAt: row.created_at,
        status: row.status,
      })) || []
    )
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

/**
 * Get all confirmed bookings (for checking collisions)
 */
export async function getAllConfirmedBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')
      .order('utc_start', { ascending: true })

    if (error) {
      console.error('Error fetching all bookings:', error)
      return []
    }

    return (
      data?.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        notes: row.notes || '',
        painPoints: {
          workflowChallenge: row.workflow_challenge || '',
          sopManagement: row.sop_management || '',
          mainGoal: row.main_goal || '',
          limitingTools: row.limiting_tools || '',
          demoPreparation: row.demo_preparation || '',
        },
        date: row.selected_date,
        time: row.selected_time,
        timezoneSelected: row.timezone_selected,
        utcStart: row.utc_start,
        durationMinutes: row.duration_minutes,
        createdAt: row.created_at,
        status: row.status,
      })) || []
    )
  } catch (error) {
    console.error('Error fetching all bookings:', error)
    return []
  }
}

/**
 * Create a new booking
 */
export async function createBooking(
  bookingData: BookingData
): Promise<Booking | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        full_name: bookingData.fullName,
        email: bookingData.email,
        notes: bookingData.notes,
        workflow_challenge: bookingData.painPoints.workflowChallenge,
        sop_management: bookingData.painPoints.sopManagement,
        main_goal: bookingData.painPoints.mainGoal,
        limiting_tools: bookingData.painPoints.limitingTools,
        demo_preparation: bookingData.painPoints.demoPreparation,
        selected_date: bookingData.date,
        selected_time: bookingData.time,
        timezone_selected: bookingData.timezoneSelected,
        utc_start: bookingData.utcStart,
        duration_minutes: bookingData.durationMinutes,
        status: 'confirmed',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return null
    }

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      notes: data.notes || '',
      painPoints: {
        workflowChallenge: data.workflow_challenge || '',
        sopManagement: data.sop_management || '',
        mainGoal: data.main_goal || '',
        limitingTools: data.limiting_tools || '',
        demoPreparation: data.demo_preparation || '',
      },
      date: data.selected_date,
      time: data.selected_time,
      timezoneSelected: data.timezone_selected,
      utcStart: data.utc_start,
      durationMinutes: data.duration_minutes,
      createdAt: data.created_at,
      status: data.status,
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    return null
  }
}

/**
 * Get bookings by email
 */
export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('email', email)
      .order('utc_start', { ascending: true })

    if (error) {
      console.error('Error fetching bookings by email:', error)
      return []
    }

    return (
      data?.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        notes: row.notes || '',
        painPoints: {
          workflowChallenge: row.workflow_challenge || '',
          sopManagement: row.sop_management || '',
          mainGoal: row.main_goal || '',
          limitingTools: row.limiting_tools || '',
          demoPreparation: row.demo_preparation || '',
        },
        date: row.selected_date,
        time: row.selected_time,
        timezoneSelected: row.timezone_selected,
        utcStart: row.utc_start,
        durationMinutes: row.duration_minutes,
        createdAt: row.created_at,
        status: row.status,
      })) || []
    )
  } catch (error) {
    console.error('Error fetching bookings by email:', error)
    return []
  }
}

