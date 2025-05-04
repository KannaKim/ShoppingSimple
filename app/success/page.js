import Link from 'next/link';
import Image from 'next/image';
import {stripe} from '../api/lib/stripe';
import { decrypt } from '../lib/session';

export default async function SuccessPage({searchParams}) {
  let status = 'loading';
  const { session_id } = await searchParams
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const customer = await  stripe.checkout.sessions.listLineItems(session.id)
  status = 'success';
  // console.log("session_id", session_id)
  // console.log("session", session)
  // console.log("customer")
  // console.log(customer)
  // console.log("price")
  // console.log(customer.data[0].price)
  // console.log(customer.data[0].price.metadata)
  const customerSessionCookie = session.metadata.customerSessionCookie
  const productId = session.metadata.productId
  const customerSession = await decrypt(customerSessionCookie)
  const customerUsername = customerSession.userId
  
  const purchaseDetails = {
    name: customer.data[0].description,
    quantity: customer.data[0].quantity,
    price: session.amount_total / 100,
    username: customerUsername,
  }
  
  console.log("customerUsername")
  console.log(customerUsername)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'loading' && (
          <div className="text-gray-600">Verifying payment...</div>
        )}
        
        {status === 'success' && purchaseDetails && (
          <>
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Successful!
            </h2>
            
            <div className="mt-8 bg-white rounded-lg shadow-md p-6 text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{purchaseDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{purchaseDetails.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${parseFloat(purchaseDetails.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-medium">{purchaseDetails.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-blue-600">
                    ${(parseFloat(purchaseDetails.price) * purchaseDetails.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-gray-600">
              Thank you for your purchase. Your order has been processed successfully.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Error
            </h2>
            <p className="mt-2 text-gray-600">
              There was an error processing your payment. Please try again.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 