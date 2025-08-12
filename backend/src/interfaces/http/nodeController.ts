import { NextFunction, Request, Response } from "express";
import { CreateNodeUseCase } from "../../use-cases/CreateNodeUseCase";
import { DeleteNodeUseCase } from "../../use-cases/DeleteNodeUseCase";
import { GetAllNodesUseCase } from "../../use-cases/GetAllNodesUseCase";
import { HttpStatusCode } from "../../constants/statusCode";
import { Messages } from "../../constants/messages";


export class NodeController{
    constructor(
        private createUseCase: CreateNodeUseCase,  
        private getAllUseCase: GetAllNodesUseCase,
        private deleteUseCase: DeleteNodeUseCase
    ) { }
    
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = { name: req.body.name, parent: req.body.parent || null }
            console.log('This sis th dto get form fornted :',dto)
            const created = await this.createUseCase.execute(dto)
            return res.status(HttpStatusCode.CREATED).json(created)
        } catch (error) {
            next()
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nodes = await this.getAllUseCase.execute() 
            return res.json(nodes);
        } catch (error) {
            next()
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            await this.deleteUseCase.execute(id)
            return res.json({ message: Messages.DELETED_SUCCESSFULL });
        } catch (error) {
            next()
        }
    }
}