import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import sql from '../lib/db.js'
import { stripe } from '../lib/stripe'

export async function POST(request) {
  try {
  const headersList = await headers()
  const origin = headersList.get('origin')
  
  const body = await request.json();
  const { productId, name } = body;
  const rows = await sql`select price from products where id = ${productId}`;
  if (rows.length === 0) {
    return new Response('Product not found', { status: 404 })
  }
  const price = rows[0].price;
    console.log("price", price);
    console.log("productId", productId);
    console.log("name", name);

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price_data: {
            currency: 'cad',
            product_data: {
              name: name
            },
            unit_amount_decimal: price*100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });
    console.log("session_url", session.url)
    return NextResponse.json({url:session.url})
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}