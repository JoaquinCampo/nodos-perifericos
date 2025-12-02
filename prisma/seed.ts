import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seed data for performance testing.
 * This data must match the JMeter test data in HCEN/performance-tests/jmeter/data/
 */
async function main() {
  console.log("🌱 Starting database seed...");

  // Create specialties (matching HCEN test data)
  const specialties = [
    "Cardiology",
    "Neurology",
    "Internal Medicine",
    "Pediatrics",
  ];

  console.log("Creating specialties...");
  const specialtyRecords: Record<string, { id: string }> = {};
  for (const name of specialties) {
    const specialty = await prisma.speciality.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    specialtyRecords[name] = specialty;
    console.log(`  ✓ Specialty: ${name}`);
  }

  // Create clinics (matching clinics.csv)
  const clinics = [
    {
      name: "Clinica Test 1",
      address: "Av. Test 1234",
      phone: "24001234",
      email: "clinic1@test.com",
    },
    {
      name: "Clinica Test 2",
      address: "Av. Test 5678",
      phone: "24001235",
      email: "clinic2@test.com",
    },
    {
      name: "Clinica Test 3",
      address: "Av. Test 9012",
      phone: "24001236",
      email: "clinic3@test.com",
    },
  ];

  console.log("Creating clinics...");
  const clinicRecords: Record<string, { id: string }> = {};
  for (const clinic of clinics) {
    const created = await prisma.clinic.upsert({
      where: { id: clinic.name.replace(/\s+/g, "-").toLowerCase() },
      update: clinic,
      create: {
        id: clinic.name.replace(/\s+/g, "-").toLowerCase(),
        ...clinic,
      },
    });
    clinicRecords[clinic.name] = created;
    console.log(`  ✓ Clinic: ${clinic.name}`);
  }

  // Create health workers (matching health-workers.csv)
  const healthWorkers = [
    {
      ci: "54053584",
      firstName: "Profesional",
      lastName: "Test 54053584",
      email: "worker54053584@test.com",
      clinicName: "Clinica Test 1",
      specialty: "Cardiology",
    },
    {
      ci: "52211514",
      firstName: "Profesional",
      lastName: "Test 52211514",
      email: "worker52211514@test.com",
      clinicName: "Clinica Test 1",
      specialty: "Neurology",
    },
    {
      ci: "17714014",
      firstName: "Profesional",
      lastName: "Test 17714014",
      email: "worker17714014@test.com",
      clinicName: "Clinica Test 2",
      specialty: "Internal Medicine",
    },
    {
      ci: "19301176",
      firstName: "Profesional",
      lastName: "Test 19301176",
      email: "worker19301176@test.com",
      clinicName: "Clinica Test 2",
      specialty: "Pediatrics",
    },
    {
      ci: "52800804",
      firstName: "Profesional",
      lastName: "Test 52800804",
      email: "worker52800804@test.com",
      clinicName: "Clinica Test 3",
      specialty: "Cardiology",
    },
  ];

  console.log("Creating health workers...");
  const hashedPassword = await bcrypt.hash("Test123!", 10);

  for (const worker of healthWorkers) {
    const clinic = clinicRecords[worker.clinicName];
    if (!clinic) {
      console.error(`  ✗ Clinic not found: ${worker.clinicName}`);
      continue;
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: {
        unique_ci_per_clinic: {
          ci: worker.ci,
          clinicId: clinic.id,
        },
      },
      update: {
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        password: hashedPassword,
      },
      create: {
        ci: worker.ci,
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        password: hashedPassword,
        clinicId: clinic.id,
      },
    });

    // Create health worker record
    const healthWorker = await prisma.healthWorker.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    // Link to specialty
    const specialty = specialtyRecords[worker.specialty];
    if (specialty) {
      await prisma.healthWorkerSpeciality.upsert({
        where: {
          id: `${healthWorker.id}-${specialty.id}`,
        },
        update: {},
        create: {
          id: `${healthWorker.id}-${specialty.id}`,
          healthWorkerId: healthWorker.id,
          specialityId: specialty.id,
        },
      });
    }

    console.log(
      `  ✓ Health Worker: ${worker.firstName} ${worker.lastName} (CI: ${worker.ci}) @ ${worker.clinicName}`
    );
  }

  // Create clinic admins for each clinic
  console.log("Creating clinic admins...");
  const clinicAdmins = [
    {
      ci: "19301176",
      firstName: "Admin",
      lastName: "Clinic 1",
      email: "admin1@test.com",
      clinicName: "Clinica Test 1",
    },
    {
      ci: "52800804",
      firstName: "Admin",
      lastName: "Clinic 2",
      email: "admin2@test.com",
      clinicName: "Clinica Test 2",
    },
    {
      ci: "52537059",
      firstName: "Admin",
      lastName: "Clinic 3",
      email: "admin3@test.com",
      clinicName: "Clinica Test 3",
    },
  ];

  for (const admin of clinicAdmins) {
    const clinic = clinicRecords[admin.clinicName];
    if (!clinic) continue;

    const user = await prisma.user.upsert({
      where: {
        unique_ci_per_clinic: {
          ci: admin.ci,
          clinicId: clinic.id,
        },
      },
      update: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: hashedPassword,
      },
      create: {
        ci: admin.ci,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: hashedPassword,
        clinicId: clinic.id,
      },
    });

    await prisma.clinicAdmin.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    console.log(`  ✓ Clinic Admin: ${admin.email} @ ${admin.clinicName}`);
  }

  console.log("\n✅ Database seed completed successfully!");
  console.log("\nTest Data Summary:");
  console.log(`  - Clinics: ${clinics.length}`);
  console.log(`  - Specialties: ${specialties.length}`);
  console.log(`  - Health Workers: ${healthWorkers.length}`);
  console.log(`  - Clinic Admins: ${clinicAdmins.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

