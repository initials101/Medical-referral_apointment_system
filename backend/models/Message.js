const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User model
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User model
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachment: {
      type: String, // Stores file/image URLs (if applicable)
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt fields
);

module.exports = mongoose.model('Message', MessageSchema);
