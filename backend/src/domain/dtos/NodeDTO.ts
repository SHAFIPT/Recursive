export interface NodeDTO {
  id: string;
  name: string;
  parent?: string | null;
  createdAt: string;
}