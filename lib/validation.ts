import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu tối thiểu 8 ký tự')
  .max(128)
  .regex(/[a-z]/, 'Mật khẩu cần có chữ thường')
  .regex(/[A-Z]/, 'Mật khẩu cần có chữ hoa')
  .regex(/[0-9]/, 'Mật khẩu cần có chữ số')
  .regex(/[^a-zA-Z0-9]/, 'Mật khẩu cần có ký tự đặc biệt');
