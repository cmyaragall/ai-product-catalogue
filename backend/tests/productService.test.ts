
import { describe, expect, it } from "vitest";
import {
  getTopRated,
  searchProducts,
  type Product
} from "../src/services/productService";

const products: Product[] = [
  {
    id: 1,
    title: "Blue Backpack",
    price: 50,
    description: "Travel bag for daily use",
    category: "bags",
    image: "backpack.jpg",
    rating: { rate: 4.8, count: 100 }
  },
  {
    id: 2,
    title: "Red Jacket",
    price: 80,
    description: "Warm winter clothing",
    category: "clothing",
    image: "jacket.jpg",
    rating: { rate: 4.2, count: 200 }
  },
  {
    id: 3,
    title: "Black Shoes",
    price: 60,
    description: "Comfortable running shoes",
    category: "footwear",
    image: "shoes.jpg",
    rating: { rate: 4.9, count: 50 }
  },
  {
    id: 4,
    title: "Laptop Bag",
    price: 40,
    description: "Office and travel accessory",
    category: "bags",
    image: "laptop.jpg",
    rating: { rate: 4.8, count: 150 }
  }
];

describe("Product ranking", () => {
  it("returns products sorted by highest rating", () => {
    const result = getTopRated(products, 3);

    expect(result.map(p => p.id)).toEqual([3, 4, 1]);
  });

  it("returns only the requested number of products", () => {
    expect(getTopRated(products, 2)).toHaveLength(2);
  });

  it("does not modify the original product list", () => {
    const originalOrder = products.map(p => p.id);

    getTopRated(products, 3);

    expect(products.map(p => p.id)).toEqual(originalOrder);
  });
});

describe("Product search", () => {
  it("finds matching product titles", () => {
    const result = searchProducts(products, "backpack");

    expect(result.map(p => p.id)).toEqual([1]);
  });

  it("finds matching descriptions", () => {
    const result = searchProducts(products, "winter");

    expect(result.map(p => p.id)).toEqual([2]);
  });

  it("searches without case sensitivity", () => {
    const result = searchProducts(products, "LAPTOP");

    expect(result.map(p => p.id)).toEqual([4]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(searchProducts(products, "television")).toEqual([]);
  });
});
