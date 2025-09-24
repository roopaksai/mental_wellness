import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId
  studentId: mongoose.Types.ObjectId
  supportStaffId: mongoose.Types.ObjectId
  timeSlotId: string
  date: Date
  startTime: string
  endTime: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new Schema<IBooking>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supportStaffId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeSlotId: {
    type: String,
    required: true
  },
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
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
})

// Index for better query performance
bookingSchema.index({ studentId: 1, date: -1 })
bookingSchema.index({ supportStaffId: 1, date: -1 })

export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema)