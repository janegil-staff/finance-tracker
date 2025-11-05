import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const cookie = (await headers()).get("cookie") || "";

  let goals = [];
  let transactions = [];

  try {
    const [goalsRes, transactionsRes] = await Promise.all([
      fetch("http://localhost:3000/api/goals", {
        headers: { Cookie: cookie },
        cache: "no-store",
      }),
      fetch("http://localhost:3000/api/transactions", {
        headers: { Cookie: cookie },
        cache: "no-store",
      }),
    ]);

    if (goalsRes.ok) goals = await goalsRes.json();
    if (transactionsRes.ok) transactions = await transactionsRes.json();
  } catch (err) {
    console.error("Feil ved henting av data:", err);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-green-400">
          Din økonomioversikt
        </h1>

        {/* Goals Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Sparemål</h2>
          {goals.length === 0 ? (
            <p className="text-gray-400">Ingen sparemål registrert.</p>
          ) : (
            <ul className="space-y-2">
              {goals.map((goal) => (
                <li
                  key={goal._id}
                  className="bg-gray-900 p-4 rounded shadow flex justify-between items-center"
                >
                  <span>{goal.title}</span>
                  <span className="text-green-400">{goal.targetAmount} kr</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Transactions Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Transaksjoner</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400">Ingen transaksjoner registrert.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li
                  key={tx._id}
                  className="bg-gray-900 p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                  <span
                    className={`font-semibold ${
                      tx.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.amount} kr
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
