import { cn } from "@/lib/utils";

export function HackerNewsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      className={cn("h-5 w-5", className)}
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      data-v-9c34c54e=""
    >
      <path fill="#FB651E" d="M0 0h256v256H0z"></path>
      <path
        fill="#FFF"
        d="M119.374 144.746L75.433 62.432h20.081l25.848 52.092c.398.928.862 1.889 1.392 2.883c.53.994.994 2.022 1.391 3.082c.266.398.464.762.597 1.094c.133.33.265.63.398.894a65.643 65.643 0 0 1 1.79 3.877c.53 1.26.993 2.42 1.39 3.48a601.604 601.604 0 0 1 3.48-7.257c1.26-2.585 2.552-5.27 3.877-8.053l26.246-52.092h18.69l-44.34 83.308v53.087h-16.9v-54.081Z"
      ></path>
    </svg>
  );
}
