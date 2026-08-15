import type { Product, ProductVariant } from '@/lib/types';

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  const variants = product.variants;
  if (variants.length === 0) return undefined;
  const inStock = variants.filter((v) => v.stock > 0);
  const pool = inStock.length > 0 ? inStock : variants;
  return pool.reduce((cheapest, v) => (v.price < cheapest.price ? v : cheapest));
}

export function getTotalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function getPriceRange(product: Product): { min: number; max: number } {
  const prices = product.variants.map((v) => v.price);
  if (prices.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

const WEIGHT_SUFFIX = /-(\d+(?:[.,]\d+)?(?:kg|g|ml|l))$/i;

export function getVariantLabelFromSku(sku: string): string {
  const match = sku.match(WEIGHT_SUFFIX);
  return match ? match[1].toLowerCase() : sku;
}

export function getVariantLabel(variant: ProductVariant): string {
  return getVariantLabelFromSku(variant.sku);
}

export function getPropertyValue(
  variant: ProductVariant,
  propertyName: string,
): string | undefined {
  return variant.propertyValues.find((p) => p.propertyName === propertyName)?.value;
}

export interface BrewingGuide {
  brewingNote: string;
  temperatureNote: string;
}

export function getBrewingGuide(roastLevel: string | undefined): BrewingGuide {
  const isDarkRoast = roastLevel?.includes('Đậm') ?? false;
  return {
    brewingNote: isDarkRoast
      ? 'Thưởng thức trọn vẹn nhất với phin pha truyền thống hoặc máy Espresso để cảm nhận lớp crema sánh mịn cùng vị đắng đậm đà.'
      : 'Phù hợp nhất cho phương pháp pha Pour Over (phễu lọc V60 hoặc Chemex) để cảm nhận trọn vẹn hương hoa thanh tao và hậu vị chua dịu tinh tế.',
    temperatureNote: isDarkRoast
      ? 'Nên dùng nước sôi từ 90°C - 95°C để chiết xuất trọn vẹn vị đậm sâu và hương thơm nồng nàn.'
      : 'Nên dùng nước mềm ở nhiệt độ 92°C để lưu giữ tốt nhất độ chua thanh tự nhiên của hạt.',
  };
}
