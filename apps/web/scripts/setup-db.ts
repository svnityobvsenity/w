import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up Fride database...')

  try {
    // Create initial channels
    const channels = [
      {
        name: 'general',
        description: 'General discussion channel',
        type: 'text',
        is_private: false,
      },
      {
        name: 'announcements',
        description: 'Important announcements and updates',
        type: 'text',
        is_private: false,
      },
      {
        name: 'tickets',
        description: 'Support ticket discussions',
        type: 'ticket',
        is_private: false,
      },
      {
        name: 'Voice Lounge',
        description: 'Voice chat channel',
        type: 'voice',
        is_private: false,
      },
    ]

    console.log('📝 Creating channels...')
    for (const channel of channels) {
      const { error } = await supabase
        .from('channels')
        .upsert(channel, { onConflict: 'name' })

      if (error) {
        console.error(`Error creating channel ${channel.name}:`, error)
      } else {
        console.log(`✅ Created channel: ${channel.name}`)
      }
    }

    // Create admin user if it doesn't exist
    console.log('👑 Setting up admin user...')
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@fride.com',
      password: 'admin123456',
      email_confirm: true,
    })

    if (adminError && adminError.message.includes('already registered')) {
      console.log('✅ Admin user already exists')
    } else if (adminError) {
      console.error('Error creating admin user:', adminError)
    } else {
      console.log('✅ Created admin user: admin@fride.com')
      
      // Create admin profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: adminUser.user.id,
          email: adminUser.user.email!,
          username: 'admin',
          display_name: 'Administrator',
          discriminator: '0001',
          role: 'admin',
          status: 'online',
          is_online: true,
        })

      if (profileError) {
        console.error('Error creating admin profile:', profileError)
      } else {
        console.log('✅ Created admin profile')
      }
    }

    // Create sample roles
    console.log('🎭 Creating user roles...')
    const roles = [
      {
        name: 'User',
        permissions: ['read_messages', 'send_messages', 'join_voice'],
        color: '#99AAB5',
      },
      {
        name: 'Moderator',
        permissions: ['read_messages', 'send_messages', 'join_voice', 'manage_messages', 'kick_users'],
        color: '#FF6B6B',
      },
      {
        name: 'Admin',
        permissions: ['*'],
        color: '#FFD93D',
      },
    ]

    for (const role of roles) {
      const { error } = await supabase
        .from('roles')
        .upsert(role, { onConflict: 'name' })

      if (error) {
        console.error(`Error creating role ${role.name}:`, error)
      } else {
        console.log(`✅ Created role: ${role.name}`)
      }
    }

    console.log('🎉 Database setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Open http://localhost:3000 in your browser')
    console.log('3. Login with admin@fride.com / admin123456')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()
