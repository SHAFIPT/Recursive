export type NodeId = string;
export class NodeEntity {
  constructor(
    public id: NodeId | null,
    public name: string,
    public parent: NodeId | null = null,
    public createdAt: Date = new Date()
  ) {}
}
