import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gqoltejmlzvgwmlqzurf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxb2x0ZWptbHp2Z3dtbHF6dXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjQ5MzAsImV4cCI6MjA1MDAwMDkzMH0.3n8jKj8jKj8jKj8jKj8jKj8jKj8jKj8jKj8jKj8jK'
);

async function populateUserProfiles() {
  console.log('🔍 Populating user_profiles table...');
  
  try {
    // This will run the populate migration manually
    const { data, error } = await supabase.rpc('populate_user_profiles');
    
    if (error) {
      console.error('❌ Error populating user profiles:', error);
      return;
    }
    
    console.log('✅ User profiles populated successfully');
    
    // Now check how many users we have
    const { data: users, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError);
      return;
    }
    
    console.log(`📊 Total users in user_profiles: ${users.length}`);
    console.log('👥 Users:', users.map(u => `${u.email} (${u.role})`));
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

populateUserProfiles();
