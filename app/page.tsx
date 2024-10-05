"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js 13 and newer

export default function Home() {
    const [username, setUsername] = useState<string>("");
    const router = useRouter();

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        if (username.trim()) {
            localStorage.setItem('username',username)
            router.push(`/chat`);
        } else {
            alert("Please enter a username!");
        }
    }

    return (
        <div className="container mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-2 border-2 border-slate-950 p-4">
                <div className="text-center text-4xl mb-4">
                    Kotha-Chat
                </div>
                <div className="shadow-lg p-6 border-2 border-slate-950">
                    <form onSubmit={handleLogin} className="flex flex-col gap-y-3">
                        <strong className="text-2xl text-center">Login</strong>
                        <p className="text-center">
                            Enter username, no Signup required...
                        </p>
                        <label className="text-center">Username: </label>
                        <input
                            type="text"
                            className="border-2 border-black p-2 rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="border-2 border-slate-900 hover:bg-green-600 p-2 rounded mt-4"
                        >
                            <p className="text-center">Proceed</p>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
