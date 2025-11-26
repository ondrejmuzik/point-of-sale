# Supabase Database Setup Guide

This guide will help you set up Supabase as the database backend for the Point of Sale app.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (if you don't have one)
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Choose a name (e.g., "beverage-pos")
   - **Database Password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose the closest region to your location
   - **Pricing Plan**: Free tier is sufficient
5. Click "Create new project" and wait for initialization (~2 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll need two values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")
4. Keep these values handy for the next step

## Step 3: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual credentials from Step 2.

## Step 4: Create Database Tables

1. In your Supabase dashboard, click on the **SQL Editor** icon in the sidebar
2. Click "New Query"
3. Copy and paste the following SQL script:

```sql
-- Create orders table
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  order_number INTEGER NOT NULL,
  items JSONB NOT NULL,
  total TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  is_staff_order BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for key-value storage
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order_number for faster queries
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Create index on completed status for filtering
CREATE INDEX idx_orders_completed ON orders(completed);

-- Create index on is_staff_order for statistics filtering
CREATE INDEX idx_orders_is_staff_order ON orders(is_staff_order);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at in settings
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial order number counter
INSERT INTO settings (key, value)
VALUES ('orderNumber', '1')
ON CONFLICT (key) DO NOTHING;
```

4. Click "Run" to execute the script
5. You should see "Success. No rows returned" message

## Step 5: Enable Realtime (Optional but Recommended)

Realtime allows multiple devices to see updates instantly.

1. In Supabase dashboard, go to **Database** → **Replication**
2. Find the `orders` table in the list
3. Toggle the switch to enable replication for the `orders` table
4. Click "Save"

## Step 6: Configure Row Level Security (RLS)

For this temporary event app, we'll disable RLS to allow all access. For production use, you should configure proper policies.

1. In Supabase dashboard, go to **Authentication** → **Policies**
2. Find the `orders` table
3. Click "Disable RLS" (for simplicity)
4. Do the same for the `settings` table

**Alternative (More Secure)**: If you want to keep RLS enabled, add these policies:

```sql
-- Allow all operations on orders table
CREATE POLICY "Allow all operations on orders"
  ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow all operations on settings table
CREATE POLICY "Allow all operations on settings"
  ON settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Step 7: Test the Connection

1. Save all your changes
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser
4. Try creating an order
5. Check the Supabase dashboard → **Table Editor** → **orders** to see if the order was saved

## Verification Checklist

- [ ] Supabase project created
- [ ] `.env.local` file created with credentials
- [ ] Database tables created (orders, settings)
- [ ] Realtime enabled for orders table
- [ ] RLS configured or disabled
- [ ] App successfully creates and displays orders

## Database Schema Reference

### `orders` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key (timestamp-based) |
| `order_number` | INTEGER | User-facing order number |
| `items` | JSONB | Array of order items with details |
| `total` | TEXT | Total price as string (e.g., "120") |
| `timestamp` | TEXT | Time string (e.g., "14:30:25") |
| `completed` | BOOLEAN | Order completion status |
| `created_at` | TIMESTAMP | Auto-generated creation timestamp |

### `settings` Table

| Column | Type | Description |
|--------|------|-------------|
| `key` | TEXT | Setting name (primary key) |
| `value` | JSONB | Setting value (can be any JSON type) |
| `updated_at` | TIMESTAMP | Auto-updated modification timestamp |

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that `.env.local` exists in your project root
- Verify the variable names start with `VITE_`
- Restart your dev server after creating/modifying `.env.local`

### Error: "relation 'orders' does not exist"
- Make sure you ran the SQL script from Step 4
- Check the SQL Editor for any error messages
- Verify you're connected to the correct project

### Orders not syncing between devices
- Enable Realtime replication (Step 5)
- Check browser console for connection errors
- Verify both devices are using the same Supabase project

### Error: "new row violates row-level security policy"
- Disable RLS (Step 6) or add the policies shown
- Make sure policies are applied to both tables

## Need Help?

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)

## Next Steps

Once your database is set up and working:

1. **Test on multiple devices**: Open the app on different browsers/devices to verify sync
2. **Add data export**: Implement CSV/Excel export functionality (future enhancement)
3. **Configure offline mode**: Add service worker for offline support (future enhancement)
4. **Backup your data**: Use Supabase's backup features before the event
