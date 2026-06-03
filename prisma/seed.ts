import { prisma } from "../src/lib/prisma";
import { AppointmentStatus } from "../src/generated/prisma/client";

const USER_ID = "cmpxezcld000a4kvkzahd03sz";

async function main() {
  const barbers = await Promise.all([
    prisma.barber.create({
      data: { userId: USER_ID, name: "João Silva", phone: "41999990001", active: true },
    }),
    prisma.barber.create({
      data: { userId: USER_ID, name: "Pedro Santos", phone: "41999990002", active: true },
    }),
    prisma.barber.create({
      data: { userId: USER_ID, name: "Carlos Oliveira", phone: "41999990003", active: true },
    }),
  ]);

  const services = await Promise.all([
    prisma.service.create({
      data: { userId: USER_ID, name: "Corte", price: 35, duration: 30, active: true },
    }),
    prisma.service.create({
      data: { userId: USER_ID, name: "Barba", price: 25, duration: 20, active: true },
    }),
    prisma.service.create({
      data: { userId: USER_ID, name: "Corte + Barba", price: 55, duration: 45, active: true },
    }),
    prisma.service.create({
      data: { userId: USER_ID, name: "Pigmentação", price: 80, duration: 60, active: true },
    }),
  ]);

  const clients = await Promise.all([
    prisma.client.create({
      data: { userId: USER_ID, name: "Ana Costa", phone: "41988880001" },
    }),
    prisma.client.create({
      data: { userId: USER_ID, name: "Bruno Lima", phone: "41988880002" },
    }),
    prisma.client.create({
      data: { userId: USER_ID, name: "Camila Rocha", phone: "41988880003" },
    }),
    prisma.client.create({
      data: { userId: USER_ID, name: "Diego Ferreira", phone: "41988880004" },
    }),
    prisma.client.create({
      data: { userId: USER_ID, name: "Eduardo Martins", phone: "41988880005" },
    }),
  ]);

  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    const client = clients[i % clients.length];
    const barber = barbers[i % barbers.length];
    const service = services[i % services.length];
    const status = i < 5 ? AppointmentStatus.SCHEDULED : AppointmentStatus.COMPLETED;

    const appointment = await prisma.appointment.create({
      data: {
        userId: USER_ID,
        clientId: client.id,
        barberId: barber.id,
        date,
        status,
        totalPrice: Number(service.price),
        updatedAt: new Date(),
        services: {
          create: {
            serviceId: service.id,
            price: service.price,
          },
        },
      },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });