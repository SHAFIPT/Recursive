import { INodeRepository } from "../infrastructure/repositories/INodeRepository";
import { CreateNodeDTO } from "../domain/dtos/CreateNodeDTO";
import { NodeDTO } from "../domain/dtos/NodeDTO";
import { Messages } from "../constants/messages";

export class CreateNodeUseCase {
  constructor(private nodeRepo: INodeRepository) {}

  async execute(dto: CreateNodeDTO): Promise<NodeDTO> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error(Messages.NAME_REQUIRED);
    }
    return this.nodeRepo.create(dto);
  }
}
