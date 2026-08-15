'use client';

import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  width?: string;
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
                      style={c.width ? { width: c.width } : undefined}
                      className={`uppercase text-xs tracking-wider text-muted-foreground overflow-hidden text-ellipsis ${
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
                        className={`overflow-hidden text-ellipsis ${c.align === 'right' ? 'text-right' : ''}`}
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
          const actionsColumn = visibleColumns.find((c) => c.key === 'actions');
          const dataColumns = visibleColumns.filter((c) => c.key !== 'actions');
          const [primaryColumn, ...restColumns] = dataColumns;
          return (
            <Card key={row.id}>
              <CardContent className="p-4 space-y-4">
                <div className="pb-4 border-b border-border/40 flex justify-between items-start gap-4">
                  {primaryColumn && (
                    <div className="min-w-0 flex-1">
                      {primaryColumn.render(row)}
                    </div>
                  )}
                  {actionsColumn && (
                    <div className="shrink-0 flex items-center justify-end">
                      {actionsColumn.render(row)}
                    </div>
                  )}
                </div>
                {restColumns.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {restColumns.map((c) => (
                      <div key={c.key} className="flex flex-col gap-1 min-w-0">
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
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  showing,
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {showing}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            aria-label="Trang trước"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            aria-label="Trang sau"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
