import { Plant } from '../data/plants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type ApiProduct = Omit<Plant, 'id'> & {
  _id: string;
  originalPrice?: number;
};

function toPlant(product: ApiProduct): Plant {
  return {
    ...product,
    id: product._id,
  };
}

export async function getProducts(): Promise<Plant[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Unable to load products');
  }

  const payload = await response.json();
  return payload.data.products.map(toPlant);
}

export async function getProduct(id: string): Promise<Plant> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Unable to load product');
  }

  const payload = await response.json();
  return toPlant(payload.data);
}
