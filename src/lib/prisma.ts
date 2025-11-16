import { Prisma, PrismaClient } from '../generated/prisma/client.js';



export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// prisma.$use(async (params: Prisma.Middleware, next: (params: any) => Promise<any>) => {

//   const result = await next(params);

  
//   if (params.model === 'User' && params.action !== 'count') {
    
//     if (Array.isArray(result)) {
//       result.forEach(user => {
//         if (user && user.password) {
//           delete user.password;
//         }
//       });
//     } 
//     else if (result && typeof result === 'object' && result.password) {
//       delete result.password;
//     }
//   }

//   return result;
// });


