import { z } from 'zod';

// Add your Zod schemas here

// Example schema
export const exampleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  message: z.string().max(1000).optional(),
});

export type ExampleInput = z.infer<typeof exampleSchema>;
