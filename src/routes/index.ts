import express from "express";
import ContractController from '../controllers/contract';

const router = express.Router();

router.route('/contracts')
    .get(async (_req, res) => {
        const controller = new ContractController();
        const response = await controller.getAllContract();
        return res.send(response);
    })
    .post(async (_req, res) => {
    const controller = new ContractController();
    const contract = { ..._req.body }
    const response = await controller.newContract(contract);
    return res.send(response);
    })

router.route('/contracts/:id')
    .get(async (_req, res) => {
    const controller = new ContractController();
    const response = await controller.getContractById(_req.params.id);
    return res.send(response);
    })
    .put(async (_req, res) => {
    const controller = new ContractController();
    const response = await controller.updateContract(_req.params.id);
    return res.send(response);
    })
    .delete(async (_req, res) => {
        const controller = new ContractController();
        const response = await controller.deleteContract(_req.params.id);
        return res.send(response);
    });

export default router;
