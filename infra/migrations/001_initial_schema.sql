-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    username VARCHAR(32) NOT NULL,
    discriminator VARCHAR(4) NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'offline', 'away', 'dnd')),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(username, discriminator)
);

-- Channels table
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('text', 'voice', 'ticket')),
    is_private BOOLEAN DEFAULT false,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    member_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    edited_at TIMESTAMP WITH TIME ZONE,
    reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
    reactions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice rooms table
CREATE TABLE voice_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice participants table
CREATE TABLE voice_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voice_room_id UUID REFERENCES voice_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_muted BOOLEAN DEFAULT false,
    is_deafened BOOLEAN DEFAULT false,
    speaking BOOLEAN DEFAULT false,
    volume INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(voice_room_id, user_id)
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'resolved')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100),
    staff_assigned UUID REFERENCES users(id) ON DELETE SET NULL,
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#5865F2',
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Channel members junction table
CREATE TABLE channel_members (
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (channel_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username_discriminator ON users(username, discriminator);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_online ON users(is_online);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_private ON channels(is_private);
CREATE INDEX idx_channels_created_by ON channels(created_by);

CREATE INDEX idx_messages_channel_id ON messages(channel_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_voice_rooms_channel_id ON voice_rooms(channel_id);
CREATE INDEX idx_voice_participants_room_id ON voice_participants(voice_room_id);
CREATE INDEX idx_voice_participants_user_id ON voice_participants(user_id);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_staff_assigned ON tickets(staff_assigned);

CREATE INDEX idx_channel_members_channel_id ON channel_members(channel_id);
CREATE INDEX idx_channel_members_user_id ON channel_members(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read all users
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can read all channels
CREATE POLICY "Users can read all channels" ON channels FOR SELECT USING (true);

-- Only admins can create/update/delete channels
CREATE POLICY "Only admins can manage channels" ON channels FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Users can read messages in channels they have access to
CREATE POLICY "Users can read messages" ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM channels WHERE id = channel_id AND NOT is_private)
);

-- Users can create messages in channels they have access to
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM channels WHERE id = channel_id AND NOT is_private)
);

-- Users can update/delete their own messages
CREATE POLICY "Users can manage own messages" ON messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own messages" ON messages FOR DELETE USING (auth.uid() = user_id);

-- Users can read voice rooms
CREATE POLICY "Users can read voice rooms" ON voice_rooms FOR SELECT USING (true);

-- Users can join voice rooms
CREATE POLICY "Users can join voice rooms" ON voice_rooms FOR INSERT WITH CHECK (true);

-- Users can update voice rooms
CREATE POLICY "Users can update voice rooms" ON voice_rooms FOR UPDATE USING (true);

-- Users can read voice participants
CREATE POLICY "Users can read voice participants" ON voice_participants FOR SELECT USING (true);

-- Users can join voice rooms as participants
CREATE POLICY "Users can join voice rooms as participants" ON voice_participants FOR INSERT WITH CHECK (true);

-- Users can update their own voice participant status
CREATE POLICY "Users can update own voice participant status" ON voice_participants FOR UPDATE USING (auth.uid() = user_id);

-- Users can leave voice rooms
CREATE POLICY "Users can leave voice rooms" ON voice_participants FOR DELETE USING (auth.uid() = user_id);

-- Users can read tickets they created or are assigned to
CREATE POLICY "Users can read own tickets" ON tickets FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = staff_assigned
);

-- Users can create tickets
CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only staff can update tickets
CREATE POLICY "Only staff can update tickets" ON tickets FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
);

-- Users can read channel members
CREATE POLICY "Users can read channel members" ON channel_members FOR SELECT USING (true);

-- Users can join channels
CREATE POLICY "Users can join channels" ON channel_members FOR INSERT WITH CHECK (true);

-- Users can leave channels
CREATE POLICY "Users can leave channels" ON channel_members FOR DELETE USING (auth.uid() = user_id);

-- Users can read all roles
CREATE POLICY "Users can read all roles" ON roles FOR SELECT USING (true);

-- Only admins can manage roles
CREATE POLICY "Only admins can manage roles" ON roles FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Users can read user roles
CREATE POLICY "Users can read user roles" ON user_roles FOR SELECT USING (true);

-- Only admins can manage user roles
CREATE POLICY "Only admins can manage user roles" ON user_roles FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voice_rooms_updated_at BEFORE UPDATE ON voice_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voice_participants_updated_at BEFORE UPDATE ON voice_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default channels
INSERT INTO channels (name, type, description, is_private) VALUES 
('general', 'text', 'General discussion channel', false),
('announcements', 'text', 'Important announcements', false),
('voice-lobby', 'voice', 'Voice chat lobby', false);
