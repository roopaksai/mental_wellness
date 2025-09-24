import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IChatMessage extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  content: string
  sender: 'user' | 'bot'
  type: 'text' | 'suggestion' | 'resource'
  timestamp: Date
  sessionId?: string
}

const chatMessageSchema = new Schema<IChatMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot']
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'suggestion', 'resource'],
    default: 'text'
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  sessionId: {
    type: String
  }
}, {
  timestamps: true
})

// Index for better query performance
chatMessageSchema.index({ userId: 1, timestamp: -1 })
chatMessageSchema.index({ sessionId: 1, timestamp: 1 })

export const ChatMessage: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema)