
import {connect} from '../config/prisma-client'
export async function testConnection(){
    await connect();
}