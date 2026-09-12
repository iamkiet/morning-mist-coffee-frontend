export interface SortOption {
  key: string;
  label: string;
  sortBy: 'createdAt' | 'name' | 'price';
  sortDir: 'asc' | 'desc';
}

export const SORT_OPTIONS: SortOption[] = [
  { key: 'newest', label: 'Mới nhất', sortBy: 'createdAt', sortDir: 'desc' },
  { key: 'price-asc', label: 'Giá thấp đến cao', sortBy: 'price', sortDir: 'asc' },
  { key: 'price-desc', label: 'Giá cao đến thấp', sortBy: 'price', sortDir: 'desc' },
  { key: 'name-asc', label: 'Tên A đến Z', sortBy: 'name', sortDir: 'asc' },
];

export const DEFAULT_SORT_KEY = SORT_OPTIONS[0].key;

export const ROAST_OPTIONS = [
  'Nhạt',
  'Rang Sáng',
  'Rang Vừa',
  'Rang Đậm',
  'Đậm',
];

export const PROCESS_OPTIONS = [
  'Chế Biến Ướt',
  'Tự nhiên',
  'Mật ong',
  'Gió mùa',
];

export const ORIGIN_OPTIONS = [
  'Đà Lạt, Việt Nam',
  'Đắk Lắk, Việt Nam',
  'Lâm Đồng, Việt Nam',
  'Việt Nam',
  'Huila, Colombia',
  'Yirgacheffe, Ethiopia',
  'Nyeri, Kenya',
  'Kilimanjaro, Tanzania',
  'Hồ Victoria, Uganda',
  'Cerrado, Brazil',
  'Tarrazú, Costa Rica',
  'Huehuetenango, Guatemala',
  'Oaxaca, Mexico',
  'Boquete, Panama',
  'Cajamarca, Peru',
  'Lampung, Indonesia',
  'Malabar, Ấn Độ',
  'Phối trộn nhiều vùng',
];

export const ALL_VALUE = '__all__';
