// Generated types from Supabase
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Add your database types here after generating from Supabase
export interface Database {
  public: {
    Tables: {
      // Your tables will be generated here
    };
    Views: {
      // Your views will be generated here
    };
    Functions: {
      // Your functions will be generated here
    };
    Enums: {
      // Your enums will be generated here
    };
  };
}
