import type { ProductCategory } from '@/lib/types';

export interface CategoryTreeNode extends ProductCategory {
  depth: number;
}

/** Flattens a category list into parent-then-children order with a depth per
 * node, so callers can indent by `depth` instead of a "parent / child" label
 * that only reads correctly one level deep. */
export function sortCategoryTree(categories: ProductCategory[]): CategoryTreeNode[] {
  const byParent = new Map<string | null, ProductCategory[]>();
  for (const c of categories) {
    const key = c.parentId;
    const siblings = byParent.get(key) ?? [];
    siblings.push(c);
    byParent.set(key, siblings);
  }

  const result: CategoryTreeNode[] = [];
  function visit(parentId: string | null, depth: number) {
    for (const c of byParent.get(parentId) ?? []) {
      result.push({ ...c, depth });
      visit(c.id, depth + 1);
    }
  }
  visit(null, 0);
  return result;
}

export const CATEGORY_INDENT_PX = 16;
