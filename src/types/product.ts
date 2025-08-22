export interface Product {
  id: string;
  name: string;
  description: string | null;
  width_inches: number | null;
  height_inches: number | null;
  mrp: number;
  selling_price: number;
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

// Helper function to get display price
export const getDisplayPrice = (product: Product) => {
  return product.selling_price || 0;
};

// Helper function to get display MRP
export const getDisplayMRP = (product: Product) => {
  return product.mrp || 0;
};

// Helper function to get size display text
export const getSizeDisplay = (product: Product) => {
  if (product.width_inches && product.height_inches) {
    return `${product.width_inches}" x ${product.height_inches}"`;
  }
  return 'Size not specified';
};