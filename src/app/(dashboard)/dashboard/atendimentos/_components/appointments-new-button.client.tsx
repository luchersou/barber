"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { createAppointment } from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";
import { ServiceSelect } from "@/types/services";

interface AppointmentsNewButtonProps {
  clients: ClientSelect[];
  barbers: BarberSelect[];
  services: ServiceSelect[];
}

export function AppointmentsNewButton({
  clients,
  barbers,
  services,
}: AppointmentsNewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setIsOpen(false);
    setClientId("");
    setBarberId("");
    setServiceIds([]);
    setDate("");
    setTime("");
    setNotes("");
    setError(null);
    setIsLoading(false);
  }

  function toggleService(id: string) {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    try {
      setIsLoading(true);
      setError(null);
      await createAppointment({ clientId, barberId, serviceIds, date, time, notes });
      handleClose();
    } catch {
      setError("Erro ao criar atendimento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Novo Atendimento
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Novo Atendimento</DialogTitle>
            <DialogDescription className="sr-only">
              Adicione um novo atendimento
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] pr-1">
            {error && (
              <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="*:not-first:mt-1.5">
                <Label>Cliente</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="*:not-first:mt-1.5">
                <Label>Barbeiro</Label>
                <Select value={barberId} onValueChange={setBarberId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="*:not-first:mt-1.5">
                <Label>Serviços</Label>
                <div className="mt-2 space-y-2">
                  {services.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`new-${s.id}`}
                        checked={serviceIds.includes(s.id)}
                        onCheckedChange={() => toggleService(s.id)}
                      />
                      <label htmlFor={`new-${s.id}`} className="text-sm cursor-pointer">
                        {s.name} — R$ {s.price.toFixed(2)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-1.5">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="*:not-first:mt-1.5">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="*:not-first:mt-1.5">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre o atendimento..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !clientId || !barberId || serviceIds.length === 0 || !date || !time}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}