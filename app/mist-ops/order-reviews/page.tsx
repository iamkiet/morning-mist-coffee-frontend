'use client';

import { useState } from 'react';
import { MoreHorizontal, MessageSquareText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../_components/PageHeader';
import { StatCard } from '../_components/StatCard';
import { Badge } from '../_components/Badge';
import { DataTable, Pagination, type Column } from '../_components/DataTable';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useOrderReviews,
  useUpdateOrderReviewStatus,
} from '@/hooks/use-order-reviews';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import type {
  AdminOrderReview,
  ReviewCategory,
  ReviewSeverity,
  ReviewStatus,
} from '@/lib/api/order-reviews';

const ALL_STATUSES: ReviewStatus[] = [
  'pending_classification',
  'pending_review',
  'auto_responded',
  'escalated',
  'resolved',
];

const STATUS_VIETNAMESE: Record<ReviewStatus, string> = {
  pending_classification: 'Chờ phân loại',
  pending_review: 'Chờ duyệt',
  auto_responded: 'Tự động phản hồi',
  escalated: 'Đã báo cáo',
  resolved: 'Đã xử lý',
};

const STATUS_BADGE: Record<ReviewStatus, 'neutral' | 'warning' | 'info' | 'error' | 'success'> = {
  pending_classification: 'neutral',
  pending_review: 'warning',
  auto_responded: 'info',
  escalated: 'error',
  resolved: 'success',
};

const CATEGORY_VIETNAMESE: Record<ReviewCategory, string> = {
  complaint: 'Phàn nàn',
  compliment: 'Khen ngợi',
  suggestion: 'Góp ý',
  spam: 'Spam',
};

const SEVERITY_VIETNAMESE: Record<ReviewSeverity, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

const SEVERITY_BADGE: Record<ReviewSeverity, 'neutral' | 'warning' | 'error'> = {
  low: 'neutral',
  medium: 'warning',
  high: 'error',
};

const statusSchema = z.object({
  status: z.enum([
    'pending_classification',
    'pending_review',
    'auto_responded',
    'escalated',
    'resolved',
  ]),
});

type StatusForm = z.infer<typeof statusSchema>;

interface EditReviewDialogProps {
  review: AdminOrderReview;
  onClose: () => void;
}

function EditReviewDialog({ review, onClose }: EditReviewDialogProps) {
  const update = useUpdateOrderReviewStatus();
  const form = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: review.status },
  });

  function onSubmit(values: StatusForm) {
    if (values.status === review.status) {
      onClose();
      return;
    }
    update.mutate(
      { id: review.id, status: values.status },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật trạng thái đánh giá');
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Chỉnh sửa Đánh giá
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {review.commentText}
            </p>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALL_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_VIETNAMESE[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {update.isError && (
              <ErrorNotice className="mb-0">
                Không thể cập nhật đánh giá. Vui lòng thử lại.
              </ErrorNotice>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="uppercase tracking-wider text-xs"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="uppercase tracking-wider text-xs"
                disabled={update.isPending}
              >
                {update.isPending ? 'Đang lưu…' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const LIMIT = 20;
const ALL_STATUS_FILTER = 'all';

export default function AdminOrderReviewsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS_FILTER);
  const [editReview, setEditReview] = useState<AdminOrderReview | null>(null);

  const { data, isLoading, isError } = useOrderReviews(page, LIMIT, {
    filters: {
      status: statusFilter === ALL_STATUS_FILTER ? undefined : statusFilter,
    },
  });

  const reviews = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const columns: Column<AdminOrderReview>[] = [
    {
      key: 'comment',
      header: 'Bình luận',
      width: '30%',
      render: (r) => (
        <p className="text-sm text-foreground line-clamp-2">{r.commentText}</p>
      ),
    },
    {
      key: 'category',
      header: 'Phân loại',
      hideOnMobile: true,
      width: '12%',
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {r.category ? CATEGORY_VIETNAMESE[r.category] : '—'}
        </span>
      ),
    },
    {
      key: 'severity',
      header: 'Mức độ',
      hideOnMobile: true,
      width: '12%',
      render: (r) =>
        r.severity ? (
          <Badge status={SEVERITY_BADGE[r.severity]}>
            {SEVERITY_VIETNAMESE[r.severity]}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '16%',
      render: (r) => (
        <Badge status={STATUS_BADGE[r.status]}>{STATUS_VIETNAMESE[r.status]}</Badge>
      ),
    },
    {
      key: 'date',
      header: 'Ngày',
      hideOnMobile: true,
      width: '12%',
      render: (r) => (
        <span className="text-muted-foreground text-xs">
          {new Date(r.createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '10%',
      render: (r) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setEditReview(r)}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        eyebrow="Đánh giá"
        title="Quản lý Đánh giá Khách hàng"
        actions={
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-48 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS_FILTER}>Tất cả trạng thái</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_VIETNAMESE[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Tổng đánh giá"
          value={isLoading ? '—' : String(total)}
          icon={MessageSquareText}
          tone="primary"
        />
        <StatCard
          label="Chờ duyệt"
          value={
            isLoading
              ? '—'
              : String(reviews.filter((r) => r.status === 'pending_review').length)
          }
          delta="Trên trang này"
          icon={AlertTriangle}
          tone="secondary"
        />
        <StatCard
          label="Đã xử lý"
          value={
            isLoading
              ? '—'
              : String(reviews.filter((r) => r.status === 'resolved').length)
          }
          delta="Trên trang này"
          icon={CheckCircle2}
          tone="tertiary"
        />
      </section>

      {isError && (
        <ErrorNotice>
          Không thể tải danh sách đánh giá. Vui lòng thử lại.
        </ErrorNotice>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={reviews}
          footer={
            <Pagination
              showing={
                total === 0
                  ? 'Không tìm thấy đánh giá nào'
                  : `Hiển thị ${offset + 1}–${Math.min(offset + reviews.length, total)} trên ${total}`
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
        />
      )}

      {editReview && (
        <EditReviewDialog review={editReview} onClose={() => setEditReview(null)} />
      )}
    </div>
  );
}
