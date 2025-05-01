import sql from '../lib/db';
import {createSession} from '../../lib/session';

export async function POST(request) {
    // For example, fetch data from your DB here
    const body = await request.json();
    const { username, password } = body;
    const record = await sql`
    select (passhash=crypt(${password},passhash)) as success from users where username=${username}
    `
    if(record.length==0){
        return new Response("user not found",{
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    if(record[0]["success"]==false){
        return new Response("password not correct",{
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    await createSession(username)
    return new Response("success", {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
   
  