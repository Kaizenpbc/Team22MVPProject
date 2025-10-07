// Supabase Client Configuration
// This is like a special phone that talks to our Supabase database!

import { createClient } from '@supabase/supabase-js'

// Get configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types (TypeScript types that match our database structure)
export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          full_name: string
          email: string
          notes: string | null
          workflow_challenge: string | null
          sop_management: string | null
          main_goal: string | null
          limiting_tools: string | null
          demo_preparation: string | null
          selected_date: string
          selected_time: string
          timezone_selected: string
          utc_start: string
          duration_minutes: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          notes?: string | null
          workflow_challenge?: string | null
          sop_management?: string | null
          main_goal?: string | null
          limiting_tools?: string | null
          demo_preparation?: string | null
          selected_date: string
          selected_time: string
          timezone_selected: string
          utc_start: string
          duration_minutes?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          notes?: string | null
          workflow_challenge?: string | null
          sop_management?: string | null
          main_goal?: string | null
          limiting_tools?: string | null
          demo_preparation?: string | null
          selected_date?: string
          selected_time?: string
          timezone_selected?: string
          utc_start?: string
          duration_minutes?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      check_booking_collision: {
        Args: {
          check_utc_start: string
          exclude_booking_id?: string
        }
        Returns: boolean
      }
    }
  }
}

