
import axios from "axios";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get<Product[]>(
    "https://fakestoreapi.com/products",
    { timeout: 10000 }
  );

  return response.data;
}

export function getTopRated(products: Product[], count = 5) {
  return [...products]
    .sort((a, b) =>
      b.rating.rate - a.rating.rate ||
      b.rating.count - a.rating.count ||
      a.id - b.id
    )
    .slice(0, count);
}

export function searchProducts(products: Product[], term: string) {
  const query = term.trim().toLowerCase();

  return products.filter(product =>
    product.title.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );
}
