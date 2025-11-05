"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        setError("Registrering fullført, men innlogging feilet");
      } else {
        router.push("/dashboard");
      }
    } else {
      const data = await res.json();
      setError(data.error || "Noe gikk galt");
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg space-y-4"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Opprett konto</h1>
          <p className="text-sm text-gray-400">Start din økonomiske reise</p>
        </div>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <input name="name" type="text" placeholder="Navn" className="w-full px-4 py-2 bg-gray-800 rounded text-white" required />
        <input name="email" type="email" placeholder="E-post" className="w-full px-4 py-2 bg-gray-800 rounded text-white" required />
        <input name="password" type="password" placeholder="Passord" className="w-full px-4 py-2 bg-gray-800 rounded text-white" required />

        <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold">
          Registrer deg
        </button>

        <p className="text-sm text-center text-gray-400">
          Har du allerede konto?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Logg inn
          </a>
        </p>
      </form>
    </div>
  );
}
