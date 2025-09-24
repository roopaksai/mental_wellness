import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../lib/mongodb'
import { User, Assessment, StudentSupport } from '../lib/models'

async function seedDatabase() {
  try {
    await connectToDatabase()
    console.log('Connected to database')

    // Clear existing data
    await User.deleteMany({})
    await Assessment.deleteMany({})
    await StudentSupport.deleteMany({})
    console.log('Cleared existing data')

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const users = [
      { email: 'student@test.com', name: 'Alex Student', role: 'student', password: hashedPassword },
      { email: 'admin@test.com', name: 'Sarah Admin', role: 'admin', password: hashedPassword },
      { email: 'support@test.com', name: 'Dr. Mike Support', role: 'support', password: hashedPassword },
      { email: 'student2@test.com', name: 'Jamie Student', role: 'student', password: hashedPassword },
      { email: 'emma.j@university.edu', name: 'Emma Johnson', role: 'student', password: hashedPassword },
      { email: 'm.chen@university.edu', name: 'Michael Chen', role: 'student', password: hashedPassword },
      { email: 's.williams@university.edu', name: 'Sarah Williams', role: 'student', password: hashedPassword },
      { email: 'd.rodriguez@university.edu', name: 'David Rodriguez', role: 'student', password: hashedPassword },
    ]

    const createdUsers = await User.insertMany(users)
    console.log(`Created ${createdUsers.length} users`)

    // Create sample assessments for students
    const students = createdUsers.filter(user => user.role === 'student')
    
    const sampleAssessments = [
      {
        userId: students[0]._id,
        phq9Score: 8,
        parsScore: 12,
        riskLevel: 'moderate',
        answers: [
          { questionId: 'phq1', answer: '1', score: 1 },
          { questionId: 'phq2', answer: '2', score: 2 },
          // Add more as needed
        ],
        completedAt: new Date('2024-01-15')
      },
      {
        userId: students[1]._id,
        phq9Score: 15,
        parsScore: 18,
        riskLevel: 'high',
        answers: [
          { questionId: 'phq1', answer: '2', score: 2 },
          { questionId: 'phq2', answer: '3', score: 3 },
          // Add more as needed
        ],
        completedAt: new Date('2024-01-14')
      },
      {
        userId: students[2]._id,
        phq9Score: 4,
        parsScore: 6,
        riskLevel: 'low',
        answers: [
          { questionId: 'phq1', answer: '0', score: 0 },
          { questionId: 'phq2', answer: '1', score: 1 },
          // Add more as needed
        ],
        completedAt: new Date('2024-01-13')
      }
    ]

    const createdAssessments = await Assessment.insertMany(sampleAssessments)
    console.log(`Created ${createdAssessments.length} assessments`)

    // Create sample student support registrations
    const supportRegistrations = [
      {
        userId: students[1]._id, // High risk student
        preferredContactMethod: 'video',
        notes: 'Experiencing high anxiety levels, prefers evening sessions',
        availableSlots: [
          {
            date: new Date('2024-01-20'),
            startTime: '14:00',
            endTime: '15:00',
            isBooked: false
          },
          {
            date: new Date('2024-01-21'),
            startTime: '16:00',
            endTime: '17:00',
            isBooked: false
          }
        ],
        isActive: true
      }
    ]

    const createdSupport = await StudentSupport.insertMany(supportRegistrations)
    console.log(`Created ${createdSupport.length} support registrations`)

    console.log('Database seeding completed successfully!')
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    process.exit(0)
  }
}

seedDatabase()