import bcrypt from 'bcryptjs'
import { getDatabase } from '../lib/mongodb'

async function createAdmin() {
  try {
    console.log('🚀 Creating admin user...')
    console.log('🔗 Connecting to MongoDB...')
    
    // Connect to database using your existing MongoDB setup
    const db = await getDatabase()
    const usersCollection = db.collection('users')
    
    console.log('✅ Connected to MongoDB')

    // Admin user details
    const adminData = {
      id: 'rudra',
      email: 'sairoopak2005@gmail.com',
      name: 'System Administrator',
      role: 'admin' as const,
      password: '1234' // Simple password as requested
    }

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { email: adminData.email }, 
        { id: adminData.id }
      ]
    })
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists')
      console.log('Existing admin:', {
        id: existingAdmin.id,
        email: existingAdmin.email,
        name: existingAdmin.name,
        role: existingAdmin.role
      })
      return
    }

    // Hash the password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    // Create admin user document
    const adminUser = {
      id: adminData.id,
      email: adminData.email,
      password: hashedPassword,
      name: adminData.name,
      role: adminData.role,
      createdAt: new Date('2024-09-24T10:00:00.000Z'),
      updatedAt: new Date('2024-09-24T10:00:00.000Z')
    }

    console.log('📝 Inserting admin user...')
    const result = await usersCollection.insertOne(adminUser)
    
    console.log('\n🎉 Admin user created successfully!')
    console.log('═══════════════════════════════════')
    console.log('📧 Email:', adminData.email)
    console.log('🔑 Password:', adminData.password)
    console.log('👤 User ID:', adminData.id)
    console.log('🛡️  Role: admin')
    console.log('🆔 MongoDB ID:', result.insertedId)
    console.log('═══════════════════════════════════')
    console.log('💡 You can now login to the admin dashboard')

  } catch (error) {
    console.error('❌ Error creating admin:', error)
    
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      
      if (error.message.includes('not permitted')) {
        console.log('\n🚨 Permission Error Solutions:')
        console.log('1. Check your MongoDB Atlas user permissions')
        console.log('2. Ensure your IP is whitelisted in Network Access')
        console.log('3. Verify database access permissions')
        console.log('4. Check if your cluster is paused')
      }
      
      if (error.message.includes('authentication')) {
        console.log('\n🔐 Authentication Error:')
        console.log('1. Verify username and password in connection string')
        console.log('2. Check if database user has correct roles')
      }
    }
  } finally {
    process.exit(0)
  }
}

// Run the script
createAdmin()