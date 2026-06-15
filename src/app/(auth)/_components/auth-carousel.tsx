"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/auth/barbershop-1.jpg",
    quote: "Estilo é uma forma de dizer quem você é sem precisar falar.",
  },
  {
    image: "/auth/barbershop-2.jpg",
    quote: "Cada corte conta uma história.",
  },
  {
    image: "/auth/barbershop-3.jpg",
    quote: "Tradição e modernidade em cada detalhe.",
  },
];

export function AuthCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="text-3xl font-semibold leading-tight">{slide.quote}</p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === current ? "w-8 bg-white" : "w-1.5 bg-white/50"
            )}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}