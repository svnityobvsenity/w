import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@fride.com',
      password: 'admin123456',
      email_confirm: true
    })

    if (adminError) {
      console.error('Error creating admin user:', adminError)
      return
    }

    console.log('✅ Admin user created:', adminUser.user?.id)

    // Create admin profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: adminUser.user!.id,
        email: 'admin@fride.com',
        display_name: 'Admin User',
        username: 'admin',
        discriminator: '0001',
        role: 'admin'
      })

    if (profileError) {
      console.error('Error creating admin profile:', profileError)
      return
    }

    console.log('✅ Admin profile created')

    // Create sample channels
    const channels = [
      { name: 'general', type: 'text', description: 'General discussion channel' },
      { name: 'announcements', type: 'text', description: 'Server announcements' },
      { name: 'tickets', type: 'ticket', description: 'Support tickets' },
      { name: 'General', type: 'voice', description: 'General voice channel' },
      { name: 'Gaming', type: 'voice', description: 'Gaming voice channel' }
    ]

    for (const channel of channels) {
      const { error } = await supabase
        .from('channels')
        .insert(channel)

      if (error) {
        console.error(`Error creating channel ${channel.name}:`, error)
      } else {
        console.log(`✅ Channel created: ${channel.name}`)
      }
    }

    // Create sample roles
    const roles = [
      { name: 'Member', color: '#5865F2', permissions: ['send_messages', 'read_messages'] },
      { name: 'Moderator', color: '#FEE75C', permissions: ['send_messages', 'read_messages', 'manage_messages', 'manage_tickets'] },
      { name: 'Admin', color: '#ED4245', permissions: ['*'] }
    ]

    for (const role of roles) {
      const { error } = await supabase
        .from('roles')
        .insert(role)

      if (error) {
        console.error(`Error creating role ${role.name}:`, error)
      } else {
        console.log(`✅ Role created: ${role.name}`)
      }
    }

    // Create sample tickets
    const tickets = [
      { title: 'Need help with voice chat', priority: 'medium' },
      { title: 'Bug report: messages not loading', priority: 'high' },
      { title: 'Feature request: dark mode toggle', priority: 'low' }
    ]

    for (const ticket of tickets) {
      // Create a private channel for the ticket
      const { data: channel, error: channelError } = await supabase
        .from('channels')
        .insert({
          name: `ticket-${ticket.title}`,
          type: 'ticket',
          is_private: true,
          member_count: 1
        })
        .select()
        .single()

      if (channelError) {
        console.error(`Error creating channel for ticket ${ticket.title}:`, channelError)
        continue
      }

      // Create the ticket
      const { error: ticketError } = await supabase
        .from('tickets')
        .insert({
          ...ticket,
          user_id: adminUser.user!.id,
          channel_id: channel.id
        })

      if (ticketError) {
        console.error(`Error creating ticket ${ticket.title}:`, ticketError)
      } else {
        // Add admin user to the ticket channel
        const { error: memberError } = await supabase
          .from('channel_members')
          .insert({
            channel_id: channel.id,
            user_id: adminUser.user!.id
          })

        if (memberError) {
          console.error(`Error adding admin to ticket channel ${ticket.title}:`, memberError)
        } else {
          console.log(`✅ Ticket created: ${ticket.title}`)
        }
      }
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('📧 Admin login: admin@fride.com / admin123456')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
}

seed()
