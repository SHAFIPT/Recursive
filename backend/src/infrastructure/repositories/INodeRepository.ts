import { CreateNodeDTO } from "../../domain/dtos/CreateNodeDTO";
import { NodeDTO } from "../../domain/dtos/NodeDTO";

export interface INodeRepository {
  create(dto: CreateNodeDTO): Promise<NodeDTO>;
  findAll(): Promise<NodeDTO[]>;
  findById(id: string): Promise<NodeDTO | null>;
  findChildren(parentId: string): Promise<NodeDTO[]>;
  deleteById(id: string): Promise<void>;
}