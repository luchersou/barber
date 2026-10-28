import { SignUp } from "@clerk/nextjs";

import { publicPageMetadata } from "@/lib/metadata";

export const metadata = publicPageMetadata({
  title: "Criar conta",
  description:
    "Crie sua conta e comece a gerenciar sua barbearia: agenda, clientes, barbeiros e faturamento.",
  path: "/sign-up",
});

export default function Page() {
  return <SignUp />;
}
