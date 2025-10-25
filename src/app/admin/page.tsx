import { redirect } from "next/navigation";
import { Paths } from "~/lib/constants/paths";

export default function AdminDashboardPage() {
  redirect(Paths.ClinicAdmins);
}
