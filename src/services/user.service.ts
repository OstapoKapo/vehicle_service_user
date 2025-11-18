import { CreateUserDto, UpdateUserDto } from "../common/dto/user.dto.js"; 
import { ApiError } from "../common/errors/api.error.js";
import { prisma } from "../lib/prisma.js";
import * as bcrypt from 'bcrypt';
import { 
    CreateUserResponse, 
    UpdateUserResponse, 
    DeleteUserResponse 
} from "../common/types/user.types.js";
import { User } from "../generated/prisma/client.js";

class UserService {
   public async createUser(dto: CreateUserDto): Promise<CreateUserResponse> {
        const existingUser = await prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) throw ApiError.Conflict('User with this email already exists');

        let hashedPassword = null;

        if (dto.isAdmin) {
            if (!dto.password || !dto.confirmPassword) throw ApiError.BadRequest('Password is required to create an admin');
            if (dto.password !== dto.confirmPassword) throw ApiError.BadRequest('Passwords do not match');
            hashedPassword = await bcrypt.hash(dto.password, 10);
        } else {
            hashedPassword = null;
        }

        const newUser = await prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                isAdmin: dto.isAdmin,
                password: hashedPassword
            }
        });

        return { message: 'User successfully created' };
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
    }

    public async getAllUsers(page: number, limit: number): Promise<{ users: User[]; total: number, totalPages: number }> {
        const skip = (page - 1) * limit;

        const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            where: { isAdmin: false },
            skip: skip,
            take: limit,
            orderBy: { createdAt: 'desc' } 
        }),
        prisma.user.count({ where: { isAdmin: false } })
    ]);
        
        return { users, total, totalPages: Math.ceil(total / limit) };
    }

    public async getUserById(id: string): Promise<User | null> {
        return await prisma.user.findFirst({
            where: { id, isAdmin: false }
        });
    }

    public async deleteUser(id: string): Promise<DeleteUserResponse> {
        const user = await prisma.user.findUnique({ where: { id } });
        
        if (!user) throw ApiError.NotFound('User not found');
        
        if (user.isAdmin) {
            throw ApiError.Forbidden('Cannot delete an admin account');
        }

        await prisma.user.delete({ where: { id } });
        
        return { message: 'User successfully deleted' };
    }

    public async updateUser(id: string, updateData: UpdateUserDto): Promise<UpdateUserResponse> {
        const targetUser = await prisma.user.findUnique({ where: { id } });

        if (!targetUser) throw ApiError.NotFound('User not found');

        if (targetUser.isAdmin) {
            throw ApiError.Forbidden('Cannot update an admin account via this endpoint');
        }

        const isUser = await prisma.user.findUnique({ where: { email: updateData.email } });
        if (isUser && isUser.id !== id) {
            throw ApiError.Conflict('Email is already in use by another user');
        }

        
        await prisma.user.update({ where: { id }, data: updateData});

        return { message: 'User successfully updated' };
    }
}

export default new UserService();