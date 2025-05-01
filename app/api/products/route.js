import sql from '../lib/db';

export async function POST(request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name');
    const price = formData.get('price');
    const img = formData.get('image') ? formData.get('image').name : null;
    const description = formData.get('description');
    const username = formData.get('username');
    if (!name || !price || !username) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const [product] = await sql`
      INSERT INTO products (name, price, img, description, username)
      VALUES (${name}, ${price}, ${img}, ${description}, ${username})
      RETURNING *;
    `;
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC;`;
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
} 