import { NextResponse } from "next/server";
import { authGuard } from "~/server/auth/auth-guard";
import { findAllHealthUsers } from "~/server/services/health-user";

export async function GET(request: Request) {
  try {
    const session = await authGuard("HealthWorkers");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";

    // Get all health users for the clinic
    const healthUsers = await findAllHealthUsers(session.user.clinic.id);

    // Filter by search term (CI or name)
    const filteredUsers = healthUsers.filter((user) => {
      const searchLower = search.toLowerCase();
      return user.ci?.toLowerCase().includes(searchLower) ??
        user.firstName.toLowerCase().includes(searchLower) ??
        user.lastName.toLowerCase().includes(searchLower) ?? false;
    });

    // Return simplified data for the dropdown
    const simplifiedUsers = filteredUsers.map((user) => ({
      ci: user.ci!,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }));

    return NextResponse.json(simplifiedUsers);

  } catch (error) {
    console.error("Error fetching health users:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
