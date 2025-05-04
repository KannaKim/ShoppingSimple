import { decrypt } from '../../../lib/session';
import sql from '../../lib/db';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export async function DELETE(request,{params}) {
    const productId = await(params).id;
    // const productId = url.pathname.split('/').pop();
    const username =   (await decrypt((await cookies()).get('session')?.value)).userId;
    if ( !username ){
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    try {
      const [product] = await sql`
        DELETE FROM products
        WHERE id = ${productId} and username=${username}
        RETURNING *;
      `;
      if (!product) {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
      }
      return new Response(JSON.stringify(product), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [product] = await sql`SELECT * FROM products WHERE id = ${id}`;
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}