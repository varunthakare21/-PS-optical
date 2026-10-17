import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'customer' | 'worker' | 'admin';
  accountStatus: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  storeId?: mongoose.Types.ObjectId;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  mfaEnabled: boolean;
  mfaSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'worker', 'admin'], default: 'customer' },
  accountStatus: { type: String, enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'pending_verification' },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date,
  storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
  avatar: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: String,
}, { timestamps: true });

userSchema.index({ role: 1 });
userSchema.index({ storeId: 1 });

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

export const User = mongoose.model<IUser>('User', userSchema);
