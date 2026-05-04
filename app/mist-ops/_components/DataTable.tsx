import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  hideOnMobile?: boolean;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  footer?: ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  footer,
}: DataTableProps<T>) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((c) => (
                    <TableHead
                      key={c.key}
                      className={`uppercase text-xs tracking-wider text-muted-foreground ${
                        c.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {c.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} className="group">
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={c.align === 'right' ? 'text-right' : ''}
                      >
                        {c.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {rows.map((row) => {
          const visibleColumns = columns.filter((c) => !c.hideOnMobile);
          const [primaryColumn, ...restColumns] = visibleColumns;
          return (
            <Card key={row.id}>
              <CardContent className="p-4 space-y-4">
                {primaryColumn && (
                  <div className="pb-4 border-b border-border/40">
                    {primaryColumn.render(row)}
                  </div>
                )}
                {restColumns.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {restColumns.map((c) => (
                      <div key={c.key} className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          {c.header}
                        </span>
                        <div className="text-sm">{c.render(row)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {footer && <div className="mt-4">{footer}</div>}
    </>
  );
}

interface PaginationProps {
  showing: string;
  current: number;
  total: number;
  showEllipsis?: boolean;
}

export function Pagination({
  showing,
  current,
  total,
  showEllipsis,
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(3, total) }, (_, i) => i + 1);
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {showing}
      </p>
      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer transition-colors ${
              p === current
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {p}
          </button>
        ))}
        {showEllipsis && (
          <>
            <span className="text-muted-foreground mx-1">...</span>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-muted-foreground hover:bg-muted cursor-pointer">
              {total}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
