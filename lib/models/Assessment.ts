import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAssessment extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  phq9Score: number
  parsScore: number
  riskLevel: 'low' | 'moderate' | 'high'
  answers: {
    questionId: string
    answer: string
    score: number
  }[]
  completedAt: Date
  createdAt: Date
}

const assessmentSchema = new Schema<IAssessment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phq9Score: {
    type: Number,
    required: true,
    min: 0,
    max: 27
  },
  parsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 30
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['low', 'moderate', 'high']
  },
  answers: [{
    questionId: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }],
  completedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for better query performance
assessmentSchema.index({ userId: 1, completedAt: -1 })

export const Assessment: Model<IAssessment> = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', assessmentSchema)