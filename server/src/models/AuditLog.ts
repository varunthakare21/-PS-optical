import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  userRole: String,
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: String,
  details: Schema.Types.Mixed,
  ip: String,
  userAgent: String,
}, { timestamps: true });

auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
