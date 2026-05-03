import Image from "next/image";
import { notFound } from "next/navigation";
import { Coffee, Thermometer, Leaf } from "lucide-react";
import { Container } from "../../../_components/Container";
import { Badge } from "@/components/ui/badge";
import { fetchProduct } from "@/lib/api/products";
import { AddToBag } from "./AddToBag";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  return (
    <Container className="pt-32 pb-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7 space-y-md">
          <div className="relative aspect-[4/5] bg-muted rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(85,98,84,0.1)] group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVv_Y7AuV3SQ2_PInfb9DQSheu6W6SyJqmxNjMwMuXT-YYPPcxhxBxB78t4G8j_VcP3jFRkvE6QVYPbD5Mm0RCeEbLH7_pT9MKeGnEpWhEkeiZ16CfQnlHDadO0aUWnZBkabhA6OLjZhlIfIiQV8Lv_HIG7y9CfyP_0-lpsn2Oh4fjuPdm-sqdCt3CQIs94h2RruM2QTWOU3LCaLITpgwHhiNY62lyEpSKVk6dxSA1TaWV3dsdu6DpwEBtmjVtSodNG7drDkN39xA"
                alt="Brewing method"
                fill
                sizes="(max-width: 1024px) 50vw, 29vw"
                className="object-cover opacity-90"
              />
            </div>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8xylaIsY0XklHfzDTO3hjarmJ2FFCMxExe7_z_ngPwh_3_RF8PX5dIGN3e_Wq9BZ-6ZFOBInB0QHfC3_Gw5zooK3zPWsv0lvSZQ9e9mg4kmbyGS_JkfXbP0JwhkDQ-OS4mXvhoTYH3QWQtjsC-5_bPKNjKjl3d78PFm1cuEAR7eX8Xh3xrYok2qPUXPCAvMMacXiE8xC-F7b6zeoU8CB8M-UuWVy7jvoczC_0gYP-Wx-cVPEiMHwQCK5b6oVAQUG3b1q5jWizQDI"
                alt="Atmospheric detail"
                fill
                sizes="(max-width: 1024px) 50vw, 29vw"
                className="object-cover opacity-90"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <header className="mb-md">
            <span className="text-primary tracking-[0.2em] mb-2 block uppercase text-xs">
              Reserve Series
            </span>
            <h1 className="text-4xl md:text-5xl text-foreground mb-1">{product.name}</h1>
            <p className="text-muted-foreground font-light">
              Single Origin {product.origin}
            </p>
          </header>

          <div className="mb-lg">
            <p className="text-muted-foreground leading-relaxed">
              A delicate expression of dawn in the highlands. This limited reserve is harvested
              at peak maturity, offering a translucent clarity that dances between misty
              clarity and floral elegance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-lg">
            <div className="p-md bg-card rounded-lg border border-border text-center">
              <span className="text-muted-foreground block mb-1 uppercase text-xs tracking-wider">Roast Level</span>
              <span className="text-primary font-medium">Light</span>
            </div>
            <div className="p-md bg-card rounded-lg border border-border text-center">
              <span className="text-muted-foreground block mb-1 uppercase text-xs tracking-wider">Process</span>
              <span className="text-primary font-medium">Washed</span>
            </div>
            <div className="col-span-2 p-md bg-card rounded-lg border border-border flex flex-col items-center">
              <span className="text-muted-foreground block mb-2 uppercase text-xs tracking-wider">Tasting Notes</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {product.notes.map((note) => (
                  <Badge key={note} variant="outline" className="uppercase tracking-wider text-[11px]">{note}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-lg space-y-2">
            <h3 className="text-foreground border-b border-border pb-1 uppercase text-xs tracking-wider">
              Brewing Ritual
            </h3>
            <div className="flex items-start gap-md py-2">
              <Coffee className="size-5 text-primary shrink-0" />
              <p className="text-muted-foreground text-sm">
                Best enjoyed as a Pour Over (V60 or Chemex) to unlock the intricate floral architecture.
              </p>
            </div>
            <div className="flex items-start gap-md py-2">
              <Thermometer className="size-5 text-primary shrink-0" />
              <p className="text-muted-foreground text-sm">
                Brew with 92°C soft water to maintain the delicate acidity of the beans.
              </p>
            </div>
          </div>

          <div className="space-y-md">
            <AddToBag product={product} />
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Leaf className="size-3.5" />
              <span>Sustainably sourced &amp; compostable packaging</span>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
