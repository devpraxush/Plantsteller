import { Schema, model } from 'mongoose';

export interface IChatMessage {
  _id?: string;
  userId: string;
  message: string;
  response: string;
  type: 'text' | 'recommendation' | 'care-tip';
  plantContext?: {
    plantId: string;
    plantName: string;
  };
  createdAt?: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'recommendation', 'care-tip'],
      default: 'text',
    },
    plantContext: {
      plantId: String,
      plantName: String,
    },
  },
  { timestamps: true }
);

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);
