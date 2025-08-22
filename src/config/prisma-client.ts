import { PrismaClient } from "@prisma/client";

 export const prisma = new PrismaClient();

export async function connect(){
    try{
        await prisma.$connect();
        console.log("Sucessfully connected to the database");
    }
    catch(error){
     console.log("Error connection to the database");
    }
}

export async function disconnect(){ 
    await prisma.$disconnect();
    console.log("Disconneting from the database")
}

