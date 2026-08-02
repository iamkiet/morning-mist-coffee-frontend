/**
 * Roast level, processing method and brewing guidance are not returned by the
 * API, so they are inferred from the product name. This is a stopgap: any
 * product whose name matches nothing falls back to the light/washed defaults,
 * which may be wrong. Move these onto the product record when the API grows
 * the fields.
 */

const ROBUSTA_NAMES = [
  'Tĩnh Lặng Ban Trưa',
  'Hồn Đất Tây Nguyên',
  'Hoài Niệm Phố Cổ',
  'Gió Mùa Ấn Độ',
  'Sumatra Rừng Già',
  'Đại Ngàn Hùng Vĩ',
  'Bugisu Hoang Dã',
];

const DARK_ROAST_KEYWORDS = ['Đậm', 'Đại Ngàn', 'Bugisu'];

const MEDIUM_ROAST_KEYWORDS = [
  'Trưa',
  'Hoài Niệm',
  'Mật Ong',
  'Ấn Độ',
  'Sumatra',
  'Nam Mỹ',
];

const PROCESS_METHODS: { keywords: string[]; label: string }[] = [
  { keywords: ['Mật Ong'], label: 'Honey (Sơ Chế Mật Ong)' },
  { keywords: ['Nam Mỹ', 'Tự Nhiên'], label: 'Natural (Sơ Chế Khô)' },
  { keywords: ['Ấn Độ', 'Gió Mùa'], label: 'Monsooned (Phơi Gió Mùa)' },
  { keywords: ['Sumatra', 'Rừng Già'], label: 'Wet-Hulled (Giling Basah)' },
];

export interface ProductAttributes {
  isRobusta: boolean;
  roastLevel: string;
  processMethod: string;
  brewingNote: string;
  temperatureNote: string;
}

function matches(name: string, keywords: string[]) {
  return keywords.some((k) => name.includes(k));
}

export function getProductAttributes(name: string): ProductAttributes {
  const isRobusta = matches(name, ROBUSTA_NAMES);

  let roastLevel = 'Rang Sáng (Light)';
  if (matches(name, DARK_ROAST_KEYWORDS)) {
    roastLevel = 'Rang Đậm (Dark)';
  } else if (matches(name, MEDIUM_ROAST_KEYWORDS)) {
    roastLevel = 'Rang Vừa (Medium)';
  }

  const processMethod =
    PROCESS_METHODS.find((m) => matches(name, m.keywords))?.label ??
    'Washed (Sơ Chế Ướt)';

  return {
    isRobusta,
    roastLevel,
    processMethod,
    brewingNote: isRobusta
      ? 'Thưởng thức trọn vẹn nhất với phin pha truyền thống hoặc máy Espresso để cảm nhận lớp crema sánh mịn cùng vị đắng đậm đà.'
      : 'Phù hợp nhất cho phương pháp pha Pour Over (phễu lọc V60 hoặc Chemex) để cảm nhận trọn vẹn hương hoa thanh tao và hậu vị chua dịu tinh tế.',
    temperatureNote: isRobusta
      ? 'Nên dùng nước sôi từ 90°C - 95°C để chiết xuất trọn vẹn vị đậm sâu và hương thơm nồng nàn.'
      : 'Nên dùng nước mềm ở nhiệt độ 92°C để lưu giữ tốt nhất độ chua thanh tự nhiên của hạt.',
  };
}
