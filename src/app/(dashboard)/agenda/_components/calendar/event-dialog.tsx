"use client";

import { useEffect, useMemo, useState } from "react";
import { RiCalendarLine, RiDeleteBinLine } from "@remixicon/react";
import { format, isBefore } from "date-fns";

import type { CalendarEvent, EventColor } from "./";
import { DefaultEndHour, DefaultStartHour, EndHour, StartHour } from "@/lib/calendar-constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClientSelect } from "@/types/clients";
import { BarberSelect } from "@/types/barbers";
import { ServiceSelect } from "@/types/services";
import { createAppointment } from "@/actions/appointment";

const statusColor: Record<string, EventColor> = {
  default: "sky",
};

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  clients: ClientSelect[];
  barbers: BarberSelect[];
  services: ServiceSelect[];
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
  clients,
  barbers,
  services,
}: EventDialogProps) {
  const [clientId, setClientId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);

  useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      setStartDate(start);
      setStartTime(formatTimeForInput(start));
      if (event.id) {
        setNotes(event.description || "");
      }
      setError(null);
    } else {
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setClientId("");
    setBarberId("");
    setSelectedServiceIds([]);
    setNotes("");
    setStartDate(new Date());
    setStartTime(`${DefaultStartHour}:00`);
    setError(null);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "h:mm a");
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    if (!clientId) {
      setError("Selecione um cliente");
      return;
    }
    if (!barberId) {
      setError("Selecione um barbeiro");
      return;
    }
    if (selectedServiceIds.length === 0) {
      setError("Selecione ao menos um serviço");
      return;
    }

    const [startHours = 0, startMinutes = 0] = startTime.split(":").map(Number);

    if (startHours < StartHour || startHours > EndHour) {
      setError(`Horário deve ser entre ${StartHour}:00 e ${EndHour}:00`);
      return;
    }

    const start = new Date(startDate);
    start.setHours(startHours, startMinutes, 0, 0);

    const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
    const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
    const end = new Date(start.getTime() + totalDuration * 60 * 1000);

    const client = clients.find((c) => c.id === clientId);
    const barber = barbers.find((b) => b.id === barberId);

    try {
      setIsLoading(true);
      setError(null);

      const dateStr = startDate.toISOString().split("T")[0];

      await createAppointment({
        clientId,
        barberId,
        serviceIds: selectedServiceIds,
        date: dateStr,
        time: startTime,
        notes,
      });

      onSave({
        id: event?.id || "",
        title: client?.name ?? "",
        description: `${barber?.name} · ${selectedServices.map((s) => s.name).join(", ")}`,
        start,
        end,
        color: "sky",
        location: `Barbeiro: ${barber?.name}`,
      });
    } catch (err) {
      setError("Erro ao salvar atendimento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {event?.id ? "Editar Atendimento" : "Novo Atendimento"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {event?.id ? "Edite os detalhes do atendimento" : "Adicione um novo atendimento"}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-4 py-4">
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="client">Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="barber">Barbeiro</Label>
            <Select value={barberId} onValueChange={setBarberId}>
              <SelectTrigger id="barber">
                <SelectValue placeholder="Selecione um barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label>Serviços</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceToggle(service.id)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    selectedServiceIds.includes(service.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-accent"
                  )}
                >
                  {service.name} · {Number(service.price).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="start-date">Data</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <span className={cn("truncate", !startDate && "text-muted-foreground")}>
                      {startDate ? format(startDate, "PPP") : "Selecione uma data"}
                    </span>
                    <RiCalendarLine
                      size={16}
                      className="text-muted-foreground/80 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    defaultMonth={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        setError(null);
                        setStartDateOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="min-w-28 *:not-first:mt-1.5">
              <Label htmlFor="start-time">Horário</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Observações sobre o atendimento..."
            />
          </div>
        </div>
        <DialogFooter className="flex-row sm:justify-between">
          {event?.id && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              aria-label="Deletar atendimento"
            >
              <RiDeleteBinLine size={16} aria-hidden="true" />
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}