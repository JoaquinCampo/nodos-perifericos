import { redirect } from "next/navigation";
import { AdminPaths } from "~/lib/constants/paths";

export default function AdminDashboardPage() {
  redirect(AdminPaths.Administrators);
}
