import { cn } from "@/lib/utils";

export function IndiehackerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={cn("h-5 w-5", className)}
    >
      <rect
        className="background"
        x="0"
        y="0"
        height="120"
        width="120"
        fill="white"
      />
      <g className="text" fill="hsl(210, 60%, 14%)">
        <rect className="text__i" x="27" y="34" height="52" width="12" />
        <rect className="text__h" x="51" y="34" height="52" width="12" />
        <rect className="text__h" x="61" y="54" height="12" width="22" />
        <rect className="text__h" x="81" y="34" height="52" width="12" />
      </g>
    </svg>
  );
}
