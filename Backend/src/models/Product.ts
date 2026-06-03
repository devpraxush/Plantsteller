import { Schema, model } from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  scientificName: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  images?: string[];
  description: string;
  longDescription: string;
  category: string;
  careLevel: 'easy' | 'moderate' | 'expert';
  light: string;
  water: string;
  humidity: string;
  temperature: string;
  size: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  season: string[];
  careTip?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    scientificName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: Number,
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    images: [String],
    description: { type: String, required: true },
    longDescription: String,
    category: { type: String, required: true },
    careLevel: {
      type: String,
      enum: ['easy', 'moderate', 'expert'],
      default: 'moderate',
    },
    light: String,
    water: String,
    humidity: String,
    temperature: String,
    size: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    season: [String],
    careTip: String,
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
