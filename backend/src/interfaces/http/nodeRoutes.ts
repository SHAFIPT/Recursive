import { Router } from "express"; 
import { NodeController } from "./nodeController";
import container from "../../container/container";

const nodeRoutes = Router();
const controller = container.resolve<NodeController>("nodeController");

nodeRoutes.get("/", (req, res, next) => controller.getAll(req, res, next));
nodeRoutes.post("/", (req, res, next) => controller.create(req, res, next));
nodeRoutes.delete("/:id", (req, res, next) => controller.delete(req, res, next));

export default nodeRoutes;
