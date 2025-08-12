import { INodeRepository } from "../infrastructure/repositories/INodeRepository";
import { NodeDTO } from "../domain/dtos/NodeDTO";

export class GetAllNodesUseCase {
  constructor(private nodeRepo: INodeRepository) {}

  async execute(): Promise<NodeDTO[]> {
    return this.nodeRepo.findAll();
  }
}