import { TrendingDown, TrendingUp } from "lucide-react";

interface VariationBadgeProps {
  value: number;
  hasData: boolean;
}

export function VariationBadge({ value, hasData }: VariationBadgeProps) {
  if (!hasData) {
    return <span className="text-muted-foreground">Sem dados no período</span>;
  }

  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <span className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
      <Icon className="h-3 w-3" />
      {isPositive ? "+" : ""}{value}% vs período equivalente
    </span>
  );
}