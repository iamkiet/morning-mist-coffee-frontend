import { NextResponse } from "next/server";
import type { Product } from "@/app/_components/ProductCard";

interface BackendProduct {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  image: string | null;
  productTypeId: string;
  createdAt: string;
  updatedAt: string;
}

function transformBackendProduct(product: BackendProduct): Product {
  const slug = product.name.toLowerCase().replace(/\s+/g, "-");
  const price = product.priceCents / 100;

  // Parse description for origin and notes
  let origin = "Morning Mist • Collection";
  let notes: string[] = [];
  let badge: string | undefined;

  if (product.description) {
    const lines = product.description.split("\n").filter((l) => l.trim());
    if (lines.length > 0) {
      origin = lines[0]; // First line is origin
      notes = lines.slice(1).filter((l) => l.trim().length > 0); // Remaining lines are notes
    }
  }

  return {
    slug,
    name: product.name,
    origin,
    price,
    image: product.image || "",
    notes,
    badge,
  };
}

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 500 }
    );
  }

  const backendUrl = "https://morning-mist-coffee-backend.onrender.com";

  try {
    const response = await fetch(`${backendUrl}/api/v1/products`);

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }

    const data = await response.json();
    const products: Product[] = data.items.map(transformBackendProduct);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products from backend:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
