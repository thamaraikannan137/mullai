import { z } from 'zod'

export const aadhaarSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\s/g, ''))
  .refine((v) => /^\d{12}$/.test(v), { message: 'Aadhaar must be 12 digits' })

export const submissionFields = {
  name: z.string().trim().min(1).max(200),
  father_name: z.string().trim().min(1).max(200),
  village: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(5).max(30),
  aadhaar: aadhaarSchema,
  email: z.string().trim().email().max(200),
}

export const joinSchema = z.object(submissionFields)

export const adminSubmissionSchema = z.object({
  ...submissionFields,
  status: z.enum(['new', 'contacted', 'archived']).default('contacted'),
})

export const submissionUpdateSchema = z.object({
  name: submissionFields.name.optional(),
  father_name: submissionFields.father_name.optional(),
  village: submissionFields.village.optional(),
  phone: submissionFields.phone.optional(),
  aadhaar: submissionFields.aadhaar.optional(),
  email: submissionFields.email.optional(),
  status: z.enum(['new', 'contacted', 'archived']).optional(),
  notes: z.string().nullable().optional(),
})
