const PRODUCT_IMAGES = [
  "/products/coffee1.png",
  "/products/coffee2.png",
  "/products/coffee3.png",
  "/products/coffee4.png",
  "/products/coffee5.png",
  "/products/coffee6.png",
  "/products/coffee7.png",
  "/products/coffee8.png",
  "/products/coffee9.png",
  "/products/coffee10.png",
  "/products/coffee11.png",
  "/products/coffee12.png",
  "/products/coffee13.png",
  "/products/coffee14.png",
  "/products/coffee15.png",
  "/products/coffee16.png",
  "/products/coffee17.png",
  "/products/coffee18.png",
  "/products/coffee19.png",
  "/products/coffee20.png",
];

export function getProductImage(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PRODUCT_IMAGES[hash % PRODUCT_IMAGES.length];
}
