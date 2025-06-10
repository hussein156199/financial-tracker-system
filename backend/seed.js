import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const seed = async () => {

    const item1 = {
        name :     "moze" ,  
        price :    10.5 ,  
        quantity : 2,
        category : "food"
    }

    const item2 = {
        name :     "plos" ,  
        price :    100 ,  
        quantity : 1,
        category : "close"
    }

    const item3 = {
        name :     "gazma" ,  
        price :    80 ,  
        quantity : 3,
        category : "food"
    }

    const userinfo = {
        total_budget: 12000,
        payments: 5000,
        remaining_budget: 12000 - 5000, // Calculate remaining budget
    }

    await prisma.Userinfo.create({
        data: userinfo,
    })


    await prisma.item.create({
        data: item1,
    })


    await prisma.item.create({
        data: item2,
    })


    await prisma.item.create({
        data: item3,
    })


}

const clear = async () => {
    await prisma.item.deleteMany();
    
    // Reset user info
    await prisma.userinfo.updateMany({
      data: {
        total_budget: 0,
        payments: 0,
        remaining_budget: 0
      }
    });
}


clear();