'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import getCookie from '../lib/cookie';

export default function LoginButton() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if(!getCookie("session")){
      setUsername("");
    }
    else{
      setUsername(getCookie("username"));
    }
  }, []);

  function handleLogout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUsername("");
  }

  if (username !== "") {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold shadow-sm"
        >
          Dashboard
        </Link>
        <button className="ml-2 bg-gray-900 text-white px-4 py-2 rounded-md font-semibold shadow-sm cursor-default" disabled>{username}</button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold shadow-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }
  return (
    <button className="ml-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-semibold shadow-sm">
      <Link href="/login" className="flex items-center">
        Login
      </Link>
    </button>
  );
} 