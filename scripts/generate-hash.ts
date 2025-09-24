import bcrypt from 'bcryptjs'

async function generateHash() {
  try {
    const password = '1234'
    const hashedPassword = await bcrypt.hash(password, 10)
    
    console.log('Password:', password)
    console.log('Hashed Password:', hashedPassword)
    
    console.log('\n📋 MongoDB Document to Insert:')
    console.log(JSON.stringify({
      id: 'rudra',
      email: 'sairoopak2005@gmail.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      createdAt: new Date('2024-09-24T10:00:00.000Z'),
      updatedAt: new Date('2024-09-24T10:00:00.000Z')
    }, null, 2))
    
    console.log('\n🔗 MongoDB Compass Instructions:')
    console.log('1. Open MongoDB Compass')
    console.log('2. Connect with: mongodb+srv://roopak:t7XvZ8fGazx5xeUB@cluster0.lxzxlsb.mongodb.net/')
    console.log('3. Go to mental_wellness database')
    console.log('4. Go to users collection')
    console.log('5. Click "Add Data" → "Insert Document"')
    console.log('6. Paste the JSON above')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

generateHash()