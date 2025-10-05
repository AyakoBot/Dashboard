export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  memberCount?: number;
  isOwner?: boolean;
  category?: string;
  permissions: string;
}