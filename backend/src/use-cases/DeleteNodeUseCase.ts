import { Messages } from "../constants/messages";
import { INodeRepository } from "../infrastructure/repositories/INodeRepository";

export class DeleteNodeUseCase {
  constructor(private nodeRepo: INodeRepository) {}

  async execute(id: string): Promise<void> {
    const node = await this.nodeRepo.findById(id);
    if (!node) {
      throw new Error(Messages.NODE_NOT_FOUND);
    }
    const deleteRecursively = async (nodeId: string) => {
      const children = await this.nodeRepo.findChildren(nodeId);
      for (const child of children) {
        await deleteRecursively(child.id);
      }
      await this.nodeRepo.deleteById(nodeId);
    };
    await deleteRecursively(id);
  }
}
