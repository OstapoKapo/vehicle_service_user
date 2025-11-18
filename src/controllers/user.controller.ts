import userService from "../services/user.service.js";
import { Request, Response } from "express";
import { ApiError } from "../common/errors/api.error.js";
import { 
    CreateUserResponse, 
    GetAllUsersResponse, 
    GetUserResponse, 
    UpdateUserResponse, 
    DeleteUserResponse 
} from "../common/types/user.types.js";

export const createUser = async (req: Request, res: Response<CreateUserResponse>): Promise<Response> => {
    console.log()
    const response = await userService.createUser(req.body);
    return res.status(201).json(response);
};

export const getUser = async (req: Request, res: Response<GetUserResponse>): Promise<Response> => {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
        throw ApiError.NotFound('User not found');
    }

    return res.status(200).json({ user });
}

export const getAllUsers = async (req: Request, res: Response<GetAllUsersResponse>): Promise<Response> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const response = await userService.getAllUsers(page, limit);
    return res.status(200).json(response);
}

export const updateUser = async (req: Request, res: Response<UpdateUserResponse>): Promise<Response> => {
    const userId = req.params.id;
    const response = await userService.updateUser(userId, req.body);
    return res.status(200).json(response);
};

export const deleteUser = async (req: Request, res: Response<DeleteUserResponse>): Promise<Response> => {
    const userId = req.params.id;
    const response = await userService.deleteUser(userId);
    
    return res.status(200).json(response);
}

export default {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
};