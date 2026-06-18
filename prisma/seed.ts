import { PrismaClient, AppointmentStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "crypto";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

const USER_ID = "cmqiwanr6000knwvk79vrsp8n";

// ─── helpers ────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], min: number, max: number): T[] {
  const count = randomInt(min, max);
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function dayOfWeekMultiplier(date: Date): number {
  const weights = [0.0, 0.65, 0.75, 0.80, 0.85, 0.95, 1.0]; // 0=Sun(closed)
  return weights[date.getDay()];
}

function appointmentsForDay(date: Date, barberCount: number): number {
  const dow = dayOfWeekMultiplier(date);
  if (dow === 0) return 0;
  const noise = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
  const raw = 5 * barberCount * dow * (1 + noise * 0.4);
  return Math.max(1, Math.round(raw));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function setHour(date: Date, hour: number, minute: number): Date {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...");

  // 1. user
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: {
      id: USER_ID,
      clerkUserId: "clerk_" + USER_ID,
      email: "owner@barberapp.dev",
      name: "Lucas (owner)",
    },
  });

  // 2. clients
  const clientData = [
    { name: "Rafael Souza",       phone: "41991110001" },
    { name: "Bruno Ferreira",     phone: "41991110002" },
    { name: "Matheus Lima",       phone: "41991110003" },
    { name: "Gabriel Oliveira",   phone: "41991110004" },
    { name: "Thiago Martins",     phone: "41991110005" },
    { name: "Diego Alves",        phone: "41991110006" },
    { name: "Felipe Costa",       phone: "41991110007" },
    { name: "Lucas Pereira",      phone: "41991110008" },
    { name: "André Ribeiro",      phone: "41991110009" },
    { name: "Caio Mendes",        phone: "41991110010" },
    { name: "Gustavo Teixeira",   phone: "41991110011" },
    { name: "Vinícius Rocha",     phone: "41991110012" },
    { name: "Henrique Nunes",     phone: "41991110013" },
    { name: "Pedro Carvalho",     phone: "41991110014" },
    { name: "Rodrigo Farias",     phone: "41991110015" },
  ];

  await prisma.client.createMany({
    data: clientData.map((c) => ({
      id: `client-${c.phone}`,
      userId: USER_ID,
      active: true,
      ...c,
    })),
    skipDuplicates: true,
  });
  const clients = await prisma.client.findMany({ where: { userId: USER_ID } });

  // 3. barbers
  const barberData = [
    { name: "Carlos Henrique", phone: "41992220001" },
    { name: "Eduardo Lima",    phone: "41992220002" },
    { name: "Fernando Dias",   phone: "41992220003" },
  ];

  await prisma.barber.createMany({
    data: barberData.map((b) => ({
      id: `barber-${b.phone}`,
      userId: USER_ID,
      active: true,
      ...b,
    })),
    skipDuplicates: true,
  });
  const barbers = await prisma.barber.findMany({ where: { userId: USER_ID } });

  // 4. services
  const serviceData = [
    { name: "Corte simples",              price: 35, duration: 30 },
    { name: "Corte + barba",              price: 55, duration: 50 },
    { name: "Barba",                      price: 30, duration: 25 },
    { name: "Degradê",                    price: 45, duration: 40 },
    { name: "Degradê + barba",            price: 65, duration: 55 },
    { name: "Corte infantil",             price: 30, duration: 25 },
    { name: "Hidratação",                 price: 40, duration: 30 },
    { name: "Sobrancelha",                price: 15, duration: 15 },
    { name: "Pezinho",                    price: 20, duration: 15 },
    { name: "Corte + barba + sobrancelha",price: 70, duration: 65 },
  ];

  await prisma.service.createMany({
    data: serviceData.map((s, i) => ({
      id: `service-${i + 1}`,
      userId: USER_ID,
      active: true,
      ...s,
    })),
    skipDuplicates: true,
  });
  const services = await prisma.service.findMany({ where: { userId: USER_ID } });

  // 5. appointments – batch insert
  console.log("📅 Generating appointments...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = addDays(today, -180);

  await prisma.appointmentService.deleteMany({
    where: { appointment: { userId: USER_ID } },
  });
  await prisma.appointment.deleteMany({ where: { userId: USER_ID } });

  const OPEN_HOUR  = 9;
  const CLOSE_HOUR = 19;

  const appointmentRows: {
    id: string;
    userId: string;
    clientId: string;
    barberId: string;
    date: Date;
    status: AppointmentStatus;
    totalPrice: number;
    notes: null;
    updatedAt: Date;
    createdAt: Date;
  }[] = [];

  const appointmentServiceRows: {
    appointmentId: string;
    serviceId: string;
    price: number;
  }[] = [];

  for (let d = new Date(startDate); d < today; d = addDays(d, 1)) {
    if (d.getDay() === 0) continue;

    const count = appointmentsForDay(d, barbers.length);
    const usedSlots = new Set<string>();

    for (let i = 0; i < count; i++) {
      const barber = pickRandom(barbers);
      const client = pickRandom(clients);

      let hour: number, minute: number, slotKey: string;
      let attempts = 0;
      do {
        hour    = randomInt(OPEN_HOUR, CLOSE_HOUR - 1);
        minute  = Math.random() < 0.5 ? 0 : 30;
        slotKey = `${barber.id}-${hour}:${minute}`;
        attempts++;
      } while (usedSlots.has(slotKey) && attempts < 20);
      usedSlots.add(slotKey);

      const appointmentDate = setHour(new Date(d), hour, minute);

      const roll = Math.random();
      const status: AppointmentStatus =
        roll < 0.78 ? AppointmentStatus.COMPLETED  :
        roll < 0.90 ? AppointmentStatus.CANCELLED  :
                      AppointmentStatus.NO_SHOW;

      const chosenServices = pickMultiple(services, 1, 2);
      const totalPrice     = chosenServices.reduce((acc, s) => acc + Number(s.price), 0);
      const id             = randomUUID();

      appointmentRows.push({
        id,
        userId:      USER_ID,
        clientId:    client.id,
        barberId:    barber.id,
        date:        appointmentDate,
        status,
        totalPrice,
        notes:       null,
        updatedAt:   appointmentDate,
        createdAt:   appointmentDate,
      });

      for (const s of chosenServices) {
        appointmentServiceRows.push({ appointmentId: id, serviceId: s.id, price: Number(s.price) });
      }
    }
  }

  // upcoming scheduled
  for (let i = 1; i <= 10; i++) {
    const futureDate = addDays(today, randomInt(1, 14));
    if (futureDate.getDay() === 0) continue;

    const barber  = pickRandom(barbers);
    const client  = pickRandom(clients);
    const chosen  = pickMultiple(services, 1, 2);
    const total   = chosen.reduce((acc, s) => acc + Number(s.price), 0);
    const hour    = randomInt(OPEN_HOUR, CLOSE_HOUR - 1);
    const minute  = Math.random() < 0.5 ? 0 : 30;
    const id      = randomUUID();

    appointmentRows.push({
      id,
      userId:    USER_ID,
      clientId:  client.id,
      barberId:  barber.id,
      date:      setHour(futureDate, hour, minute),
      status:    AppointmentStatus.SCHEDULED,
      totalPrice: total,
      notes:     null,
      updatedAt: futureDate,
      createdAt: futureDate,
    });

    for (const s of chosen) {
      appointmentServiceRows.push({ appointmentId: id, serviceId: s.id, price: Number(s.price) });
    }
  }

  // batch inserts
  const CHUNK = 500;

  for (let i = 0; i < appointmentRows.length; i += CHUNK) {
    await prisma.appointment.createMany({ data: appointmentRows.slice(i, i + CHUNK) });
  }

  for (let i = 0; i < appointmentServiceRows.length; i += CHUNK) {
    await prisma.appointmentService.createMany({ data: appointmentServiceRows.slice(i, i + CHUNK) });
  }

  console.log("✅ Seed complete!");
  console.log(`   → ${clients.length} clients`);
  console.log(`   → ${barbers.length} barbers`);
  console.log(`   → ${services.length} services`);
  console.log(`   → ${appointmentRows.length} appointments`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());