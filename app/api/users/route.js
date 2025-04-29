import sql from './lib/db.js';

export async function GET(request) {
    // For example, fetch data from your DB here
    const users = await sql`
    select *
    from users
    `
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
   
  export async function POST(request) {
    // Parse the request body
    const body = await request.json();
    const { name } = body;
   
    // e.g. Insert new user into your DB
    const newUser = { id: Date.now(), name };
   
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }