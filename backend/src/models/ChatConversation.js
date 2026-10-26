const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    sources: {
      type: [String],
      default: []
    },
    isDemoMode: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const chatConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    sessionId: {
      type: String,
      index: true
    },
    title: {
      type: String,
      default: 'College Enquiry Session'
    },
    category: {
      type: String,
      default: 'General'
    },
    messages: [messageSchema]
  },
  {
    timestamps: true
  }
);

chatConversationSchema.index({ userId: 1, createdAt: -1 });

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);
module.exports = ChatConversation;
