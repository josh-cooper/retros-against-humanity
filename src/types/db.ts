export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          state: any;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          state: any;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          state?: any;
        };
      };
    };
  };
}
