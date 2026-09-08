import { z } from 'zod';

export const HoleDataSchema = z.object({
  quantity: z.string().default(''),
  diameter: z.string().default(''),
  centerH: z.string().default(''),
  centerV: z.string().default(''),
});

export const PieceFormSchema = z.object({
  idNumber: z
    .string()
    .min(1, 'Informe o número do ID')
    .regex(/^\d+$/, 'O ID deve conter apenas números'),
  description: z
    .string()
    .min(2, 'A descrição deve ter pelo menos 2 caracteres')
    .max(250, 'A descrição é muito longa'),
  height: z.string().default(''),
  width: z.string().default(''),
  thickness: z.string().default(''),
  holesA: HoleDataSchema,
  holesB: HoleDataSchema,
  observation: z.string().default(''),
  paUsed: z.string().default(''),
  systemCode: z.string().default(''),
});

export type PieceFormSchemaType = z.infer<typeof PieceFormSchema>;
