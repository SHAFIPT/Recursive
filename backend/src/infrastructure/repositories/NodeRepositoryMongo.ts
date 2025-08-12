import { INodeRepository } from "./INodeRepository";
import { CreateNodeDTO } from "../../domain/dtos/CreateNodeDTO";
import { NodeDTO } from "../../domain/dtos/NodeDTO";
import { NodeModel } from "../models/NodeModel";
import mongoose from "mongoose";

export class NodeRepositoryMongo implements INodeRepository {
  private map(doc: any): NodeDTO {
    return {
      id: doc._id.toString(),
      name: doc.name,
      parent: doc.parent ? doc.parent.toString() : null,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  async create(dto: CreateNodeDTO): Promise<NodeDTO> {
    const doc = await NodeModel.create({ name: dto.name, parent: dto.parent || null });
    return this.map(doc);
  }

  async findAll(): Promise<NodeDTO[]> {
    const docs = await NodeModel.find().lean();
    return docs.map(this.map);
  }

  async findById(id: string): Promise<NodeDTO | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await NodeModel.findById(id).lean();
    return doc ? this.map(doc) : null;
  }

  async findChildren(parentId: string): Promise<NodeDTO[]> {
    const docs = await NodeModel.find({ parent: parentId }).lean();
    return docs.map(this.map);
  }

  async deleteById(id: string): Promise<void> {
    await NodeModel.findByIdAndDelete(id);
  }
}
