import { SignIn } from "@clerk/nextjs";

import { publicPageMetadata } from "@/lib/metadata";

export const metadata = publicPageMetadata({
  title: "Entrar",
  description:
    "Acesse o painel da Tio Dog Barbearia para gerenciar agenda, atendimentos e faturamento.",
  path: "/sign-in",
});

export default function Page() {
  return <SignIn />;
}
