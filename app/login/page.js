import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";


export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (session) redirect("/dashboard");

  return <LoginForm />;
}
