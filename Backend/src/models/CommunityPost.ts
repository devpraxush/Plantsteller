import { Schema, model } from 'mongoose';

export interface IComment {
  userId: string;
  userName: string;
  content: string;
  createdAt?: Date;
}

export interface ICommunityPost {
  _id?: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category: 'tip' | 'question' | 'discussion' | 'care-guide';
  tags: string[];
  upvotes: number;
  comments: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

const communityPostSchema = new Schema<ICommunityPost>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['tip', 'question', 'discussion', 'care-guide'],
      default: 'discussion',
    },
    tags: [String],
    upvotes: { type: Number, default: 0 },
    comments: [
      {
        userId: String,
        userName: String,
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const CommunityPost = model<ICommunityPost>('CommunityPost', communityPostSchema);
