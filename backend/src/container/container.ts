import { NodeRepositoryMongo } from "../infrastructure/repositories/NodeRepositoryMongo";
import { CreateNodeUseCase } from "../use-cases/CreateNodeUseCase";
import { GetAllNodesUseCase } from "../use-cases/GetAllNodesUseCase";
import { DeleteNodeUseCase } from "../use-cases/DeleteNodeUseCase";
import { NodeController } from "../interfaces/http/nodeController";

class Container {
  private map = new Map<string, any>();

  register(name: string, value: any) {
    this.map.set(name, value);
  }

  resolve<T>(name: string): T {
    const found = this.map.get(name);
    if (!found) throw new Error(`Dependency ${name} not found`);
    return found;
  }
}

const container = new Container();

const nodeRepo = new NodeRepositoryMongo();
container.register("nodeRepository", nodeRepo);

const createUseCase = new CreateNodeUseCase(nodeRepo);
const getAllUse = new GetAllNodesUseCase(nodeRepo);
const deleteUse = new DeleteNodeUseCase(nodeRepo);
container.register("createNodeUseCase", createUseCase);
container.register("getAllNodesUseCase", getAllUse);
container.register("deleteNodeUseCase", deleteUse);

const nodeController = new NodeController(createUseCase, getAllUse, deleteUse);
container.register("nodeController", nodeController);

export default container;
