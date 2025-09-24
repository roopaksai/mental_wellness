import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  name: string
  role: 'student' | 'admin' | 'support'
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'admin', 'support'],
    default: 'student'
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Prevent re-compilation during development
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)