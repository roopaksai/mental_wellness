import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITimeSlot {
  _id: string
  date: Date
  startTime: string
  endTime: string
  isBooked: boolean
  bookedBy?: mongoose.Types.ObjectId
}

export interface IStudentSupport extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  preferredContactMethod: 'email' | 'phone' | 'video'
  availableSlots: ITimeSlot[]
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const timeSlotSchema = new Schema<ITimeSlot>({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const studentSupportSchema = new Schema<IStudentSupport>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferredContactMethod: {
    type: String,
    required: true,
    enum: ['email', 'phone', 'video'],
    default: 'email'
  },
  availableSlots: [timeSlotSchema],
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export const StudentSupport: Model<IStudentSupport> = mongoose.models.StudentSupport || mongoose.model<IStudentSupport>('StudentSupport', studentSupportSchema)