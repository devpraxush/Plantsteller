import { Schema, model } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id?: string;
  userId: string;
  items: ICartItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = model<ICart>('Cart', cartSchema);
