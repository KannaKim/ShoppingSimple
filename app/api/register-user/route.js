import sql from '../lib/db.js';

export async function POST(request) {
    // Parse the request body
    // todo: check if body is in valid form
    const body = await request.json();
    const username  = body["username"];
    const password  = body["password"];
    const email  = body["email"];
    
    console.log("body: ",body)
    console.log("username ",username)
    console.log("email: ",email)
    console.log("password: ",password)
    try{
        await sql`insert into users(username,email,passhash) values(${username},${email},
        crypt(${password},gen_salt('bf'))
        )
        `
    }
    catch{
        return new Response("failed",{
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response("success",{
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }