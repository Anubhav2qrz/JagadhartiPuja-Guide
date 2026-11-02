export type Language = "en" | "bn";

export interface Locality {
  id: string;
  name: string;
  name_bn: string;
  slug: string;
  description?: string | null;
}

export type PandalCategory = "heritage" | "traditional" | "theme" | "prominent";

export interface AccessibilityInfo {
  wheelchair_accessible?: boolean;
  ramp_available?: boolean;
  notes?: string;
  notes_bn?: string;
}

export interface Pandal {
  id: string;
  name: string;
  name_bn: string;
  slug: string;
  description: string;
  description_bn?: string;
  address: string;
  address_bn?: string;
  locality_id?: string | null;
  locality?: Locality | null;
  latitude: number | null;
  longitude: number | null;
  cover_image_url: string;
  gallery: string[];
  category: PandalCategory;
  darshan_start?: string | null;
  darshan_end?: string | null;
  timings_verified_at?: string | null;
  is_published: boolean;
  is_verified: boolean;
  verified_at?: string | null;
  is_featured?: boolean;
  accessibility?: AccessibilityInfo;
  committee_contact?: string | null;
  created_at: string;
  updated_at: string;
}

export type PlaceCategory =
  | "sweet_shop"
  | "food_stall"
  | "restaurant"
  | "parking"
  | "restroom"
  | "water"
  | "first_aid";

export interface Place {
  id: string;
  name: string;
  name_bn: string;
  category: PlaceCategory;
  description: string;
  description_bn?: string;
  address: string;
  address_bn?: string;
  latitude: number;
  longitude: number;
  opening_hours?: Record<string, string> | string | null;
  is_published: boolean;
  is_verified: boolean;
  updated_at: string;
}

export type AnnouncementSeverity = "info" | "warning" | "alert";

export interface Announcement {
  id: string;
  title: string;
  title_bn: string;
  body: string;
  body_bn: string;
  severity: AnnouncementSeverity;
  published_at: string;
  expires_at?: string | null;
  is_published: boolean;
}

export interface Profile {
  id: string;
  preferred_language: Language;
  created_at: string;
}

export interface SavedPandal {
  user_id: string;
  pandal_id: string;
  created_at: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  pandal_id: string;
  pandal?: Pandal;
  stop_order: number;
}

export interface SavedRoute {
  id: string;
  user_id?: string | null;
  name: string;
  starting_latitude?: number | null;
  starting_longitude?: number | null;
  travel_mode: "walking" | "driving";
  created_at: string;
  updated_at: string;
  stops: RouteStop[];
}

export type SubmissionType = "correction" | "new_pandal" | "timing_update";
export type SubmissionStatus = "pending" | "reviewed" | "approved" | "rejected";

export interface Submission {
  id: string;
  submission_type: SubmissionType;
  pandal_id?: string | null;
  pandal_name?: string | null;
  submitted_data: {
    reporter_name?: string;
    reporter_contact?: string;
    description?: string;
    suggested_address?: string;
    suggested_latitude?: number | null;
    suggested_longitude?: number | null;
    darshan_timings?: string;
    source_reference?: string;
  };
  status: SubmissionStatus;
  created_at: string;
}

