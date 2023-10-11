import { icons } from "lucide-react";

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
}

export default function Icon({ name, color, size }: IconProps) {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} />;
}
