
const API_URL = "http://localhost:3001/api";

export interface EnquiryRequest {
  productId: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

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

export interface CategoryProducts {
  category: string;
  topRated: Product[];
  additional: Product[];
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getProducts: () => request<Product[]>("/products"),

  getFeatured: () => request<Product[]>("/products/featured"),

  getCategories: () => request<string[]>("/categories"),

  getCategoryProducts: (category: string) =>
    request<CategoryProducts>(
      `/categories/${encodeURIComponent(category)}/products`
    ),

  searchProducts: (term: string) =>
    request<Product[]>(
      `/products?search=${encodeURIComponent(term)}`
    ),

  submitEnquiry: async (
    enquiry: EnquiryRequest
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(enquiry)
    });

    if (!response.ok) {
      throw new Error("Unable to submit enquiry. Please try again.");
    }

    return response.json();
  }
};
