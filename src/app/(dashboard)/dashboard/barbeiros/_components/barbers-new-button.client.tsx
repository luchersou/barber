"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { createBarber } from "@/actions/barbers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BarbersNewButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setIsOpen(false);
    setName("");
    setPhone("");
    setError(null);
    setIsLoading(false);
  }

  async function handleSave() {
    try {
      setIsLoading(true);
      setError(null);
      await createBarber({ name, phone });
      handleClose();
    } catch (err) {
      setError("Erro ao criar barbeiro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Novo Barbeiro
      </Button>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Barbeiro</DialogTitle>
            <DialogDescription className="sr-only">
              Adicione um novo barbeiro à equipe
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="*:not-first:mt-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="*:not-first:mt-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 41999990001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}