export type Island =
  | "Oahu"
  | "Maui"
  | "Big Island"
  | "Kauai"
  | "Molokai"
  | "Lanai";

export type Role = "farm" | "florist";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "fulfilled";

export type Unit = "stem" | "bunch";

export interface Profile {
  id: string;
  role: Role;
  business_name: string;
  island: Island;
  contact_email: string;
  phone: string | null;
  bio: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  farm_id: string;
  flower_name: string;
  variety: string | null;
  color: string | null;
  qty_available: number;
  unit: Unit;
  price_per_unit: number;
  ready_date: string;
  photo_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  /* joined */
  farm?: Pick<Profile, "id" | "business_name" | "island" | "logo_url">;
}

export interface Order {
  id: string;
  florist_id: string;
  farm_id: string;
  status: OrderStatus;
  requested_date: string;
  notes: string | null;
  total_price: number;
  created_at: string;
  updated_at: string;
  /* joined */
  florist?: Pick<Profile, "id" | "business_name" | "contact_email" | "phone">;
  farm?: Pick<Profile, "id" | "business_name" | "contact_email" | "phone">;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  listing_id: string;
  quantity: number;
  unit_price: number; /* snapshot at time of order */
  /* joined */
  listing?: Pick<
    Listing,
    "flower_name" | "variety" | "color" | "unit" | "photo_url"
  >;
}

/* ── Supabase Database type map ─────────────────────────────── */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      listings: {
        Row: Listing;
        Insert: Omit<Listing, "id" | "farm" | "created_at" | "updated_at">;
        Update: Partial<
          Omit<Listing, "id" | "farm_id" | "farm" | "created_at" | "updated_at">
        >;
      };
      orders: {
        Row: Order;
        Insert: Omit<
          Order,
          "id" | "florist" | "farm" | "items" | "created_at" | "updated_at"
        >;
        Update: Partial<Pick<Order, "status" | "notes">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "listing">;
        Update: never;
      };
    };
  };
}
