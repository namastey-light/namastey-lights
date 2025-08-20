export interface Product {
  id: string;
  name: string;
  description: string | null;
  small_mrp: number | null;
  small_price: number | null;
  medium_mrp: number | null;
  medium_price: number | null;
  large_mrp: number | null;
  large_price: number | null;
  extra_large_mrp: number | null;
  extra_large_price: number | null;
  category_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
}

// Helper function to get display price (defaults to medium size)
export const getDisplayPrice = (product: Product) => {
  return product.medium_price || 0;
};

// Helper function to get display MRP (defaults to medium size)
export const getDisplayMRP = (product: Product) => {
  return product.medium_mrp || 0;
};

// Helper function to get price by size
export const getPriceBySize = (product: Product, size: 'small' | 'medium' | 'large' | 'extra_large') => {
  switch (size) {
    case 'small':
      return product.small_price || 0;
    case 'medium':
      return product.medium_price || 0;
    case 'large':
      return product.large_price || 0;
    case 'extra_large':
      return product.extra_large_price || 0;
    default:
      return product.medium_price || 0;
  }
};

// Helper function to get MRP by size
export const getMRPBySize = (product: Product, size: 'small' | 'medium' | 'large' | 'extra_large') => {
  switch (size) {
    case 'small':
      return product.small_mrp || 0;
    case 'medium':
      return product.medium_mrp || 0;
    case 'large':
      return product.large_mrp || 0;
    case 'extra_large':
      return product.extra_large_mrp || 0;
    default:
      return product.medium_mrp || 0;
  }
};