export interface ModelFeature {
  field: string;
  type: string;
  display_name: string;
  short_name_pt: string | null;
  unit: string | null;
  categories: Record<string, string> | null;
}
