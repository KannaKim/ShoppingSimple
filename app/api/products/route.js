import { decrypt } from '../../lib/session';
import sql from '../lib/db';
import path from 'path';
import { cookies } from 'next/headers'
import { writeFile } from "fs/promises";
import { NextResponse } from 'next/server';

export async function POST(request) {
    const formData = await request.formData()
    const name = formData.get('name');
    const price = formData.get('price');
    const img = formData.get('image');
    if( !img ){
      return new Response(JSON.stringify({ error: 'Missing image file' }), { status: 400 });
    }
    const description = formData.get('description');
    const username =   (await decrypt((await cookies()).get('session')?.value)).userId;
    // const username =  formData.get('username');  
    if ( !username ){
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    if (!name || !price) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = Date.now() + username+ img.name.replace(" ","_");
    const filepath = "/uploads"+"/"+filename;   // will be used for img src
    console.log(filename);
    
    await writeFile(
      path.join("public",filepath),
      buffer
    );
    try {
    const [product] = await sql`
      INSERT INTO products (name, price, img_filepath, description, username)
      VALUES (${name}, ${price}, ${filepath}, ${description}, ${username})
      RETURNING *;
    `;
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 