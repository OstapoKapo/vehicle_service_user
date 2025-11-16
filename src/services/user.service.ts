import { SignupDto } from "../common/dto/auth.dto.js";
import { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

class UserService {
    public async createUser(dto: SignupDto): Promise<User> {
        const user = await prisma.user.create({
            data: {
                email: dto.email,
                password: dto.password,
                firstName: dto.firstName,
                lastName: dto.lastName
            }
        });
        return user;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users;
    }

    public async getUserById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        return user;
    }

    public async deleteUser(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id }
        });
    }

    public async updateUser(id: string, updateData: Partial<SignupDto>): Promise<User> {
        const {password, ...rest} = updateData;
        const updatedUser = await prisma.user.update({
            where: { id },
            data: rest
        });
        return updatedUser;
    }
}

export default new UserService();