import { AppointmentStatus } from "../src/generated/prisma/enums";
import { prisma } from "../src/lib/prisma";

async function main() {
  // Limpa tudo antes
  await prisma.appointmentService.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // User admin
  await prisma.user.create({
    data: {
      email: "admin@barber.com",
      password: "123456", // depois troca por hash bcrypt
      name: "Administrador",
    },
  });

  // Barbeiros
  const joao = await prisma.barber.create({
    data: { name: "João Silva", phone: "41999990001", active: true },
  });
  const pedro = await prisma.barber.create({
    data: { name: "Pedro Costa", phone: "41999990002", active: true },
  });

  // Serviços
  const corte = await prisma.service.create({
    data: { name: "Corte", price: 45.0, duration: 30, active: true },
  });
  const barba = await prisma.service.create({
    data: { name: "Barba", price: 30.0, duration: 20, active: true },
  });
  const combo = await prisma.service.create({
    data: { name: "Corte + Barba", price: 65.0, duration: 50, active: true },
  });

  // Clientes
  const carlos = await prisma.client.create({
    data: { name: "Carlos Mendes", phone: "41988880001" },
  });
  const lucas = await prisma.client.create({
    data: { name: "Lucas Ferreira", phone: "41988880002" },
  });
  const rafael = await prisma.client.create({
    data: { name: "Rafael Souza", phone: "41988880003" },
  });

  // Atendimentos
  const app1 = await prisma.appointment.create({
    data: {
      clientId: carlos.id,
      barberId: joao.id,
      date: new Date("2025-05-23T09:00:00"),
      status: AppointmentStatus.SCHEDULED,
      totalPrice: 45.0,
      notes: "Cliente prefere tesoura",
      updatedAt: new Date(),
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: app1.id, serviceId: corte.id, price: 45.0 },
  });

  const app2 = await prisma.appointment.create({
    data: {
      clientId: lucas.id,
      barberId: pedro.id,
      date: new Date("2025-05-23T10:00:00"),
      status: AppointmentStatus.COMPLETED,
      totalPrice: 65.0,
      updatedAt: new Date(),
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: app2.id, serviceId: combo.id, price: 65.0 },
  });

  const app3 = await prisma.appointment.create({
    data: {
      clientId: rafael.id,
      barberId: joao.id,
      date: new Date("2025-05-23T11:00:00"),
      status: AppointmentStatus.CANCELLED,
      totalPrice: 30.0,
      updatedAt: new Date(),
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: app3.id, serviceId: barba.id, price: 30.0 },
  });

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });