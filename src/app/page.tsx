import { authGuard } from "~/server/auth/auth-guard";

export default async function HomePage() {
  await authGuard("Dashboard");

  return <div>HomePage</div>;
}
