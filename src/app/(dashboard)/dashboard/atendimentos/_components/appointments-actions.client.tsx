"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { deleteAppointment,getAppointmentByIdAction, updateAppointment } from "@/actions/appointment";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Appointment } from "@/types/appointments";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";
import { ServiceSelect } from "@/types/services";

interface AppointmentsActionsProps {
  appointment: Appointment;
  barbers: BarberSelect[];
  clients: ClientSelect[];
  services: ServiceSelect[];
}

export function AppointmentsActions({
  appointment,
  barbers,
  clients,
  services,
}: AppointmentsActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [clientId, setClientId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  async function handleEditOpen() {
    try {
      setIsLoading(true);
      const data = await getAppointmentByIdAction(appointment.id);
      if (!data) return;

      const d = new Date(data.date);
      setClientId(data.clientId);
      setBarberId(data.barberId);
      setServiceIds(data.serviceIds);
      setDate(d.toISOString().split("T")[0]);
      setTime(d.toTimeString().slice(0, 5));
      setNotes(data.notes ?? "");
      setIsEditOpen(true);
    } catch {
      setError("Erro ao carregar dados do atendimento.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEditClose() {
    setIsEditOpen(false);
    setError(null);
    setIsLoading(false);
  }

  function toggleService(id: string) {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleUpdate() {
    try {
      setIsLoading(true);
      setError(null);
      await updateAppointment(appointment.id, {
        clientId,
        barberId,
        serviceIds,
        date,
        time,
        notes,
      });
      handleEditClose();
    } catch {
      setError("Erro ao atualizar atendimento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setIsLoading(true);
      await deleteAppointment(appointment.id);
      setIsDeleteOpen(false);
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEditOpen} disabled={isLoading}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => !open && handleEditClose()}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Editar Atendimento</DialogTitle>
            <DialogDescription className="sr-only">
              Edite os dados do atendimento
            </DialogDescription>
          </DialogHeader>

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
                      id={s.id}
                      checked={serviceIds.includes(s.id)}
                      onCheckedChange={() => toggleService(s.id)}
                    />
                    <label htmlFor={s.id} className="text-sm cursor-pointer">
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
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleEditClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading || serviceIds.length === 0}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deletar Atendimento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o atendimento de{" "}
              {appointment.clientName}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deletando..." : "Deletar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}