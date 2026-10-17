import mongoose, { Schema, Document } from 'mongoose';

export interface IEyeData {
  sphere?: number;
  cylinder?: number;
  axis?: number;
  addition?: number;
  prism?: number;
  base?: string;
}

export interface IPrescription extends Document {
  customer: mongoose.Types.ObjectId;
  doctorName?: string;
  prescriptionDate?: Date;
  expiryDate?: Date;
  rightEye: IEyeData;
  leftEye: IEyeData;
  pupillaryDistance?: number;
  pdRight?: number;
  pdLeft?: number;
  notes?: string;
  documentUrl?: string;
  documentKey?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eyeDataSchema = new Schema<IEyeData>({
  sphere: Number,
  cylinder: Number,
  axis: Number,
  addition: Number,
  prism: Number,
  base: String,
}, { _id: false });

const prescriptionSchema = new Schema<IPrescription>({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: String,
  prescriptionDate: Date,
  expiryDate: Date,
  rightEye: eyeDataSchema,
  leftEye: eyeDataSchema,
  pupillaryDistance: Number,
  pdRight: Number,
  pdLeft: Number,
  notes: String,
  documentUrl: String,
  documentKey: String,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

prescriptionSchema.index({ customer: 1 });

export const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);
