import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportTicket extends Document {
  ticketNumber: string;
  customer: mongoose.Types.ObjectId;
  subject: string;
  category: 'order' | 'product' | 'prescription' | 'payment' | 'return' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  messages: {
    sender: mongoose.Types.ObjectId;
    senderRole: string;
    content: string;
    createdAt: Date;
  }[];
  relatedOrder?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>({
  ticketNumber: {
    type: String,
    default: () => `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
  },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  category: { type: String, enum: ['order', 'product', 'prescription', 'payment', 'return', 'general'], default: 'general' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'], default: 'open' },
  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    senderRole: String,
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  relatedOrder: { type: Schema.Types.ObjectId, ref: 'Order' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
}, { timestamps: true });

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
