"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email: e.target.email.value,
      password: e.target.password.value,
      redirect: false,
    });

    if (res?.error) {
      setError("Feil e-post eller passord");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg space-y-4"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Logg inn</h1>
          <p className="text-sm text-gray-400">Logg inn for å se din økonomi</p>
        </div>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="E-post"
          className="w-full px-4 py-2 bg-gray-800 rounded text-white"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Passord"
          className="w-full px-4 py-2 bg-gray-800 rounded text-white"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
        >
          Logg inn
        </button>

        <p className="text-sm text-center text-gray-400">
          Har du ikke konto?{" "}
          <a href="/register" className="text-green-400 hover:underline">
            Registrer deg
          </a>
        </p>
      </form>
    </div>
  );
}
