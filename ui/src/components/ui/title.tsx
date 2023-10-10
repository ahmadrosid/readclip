import { cn } from "@/lib/utils";

export function Title({
  children,
  className,
  as = "h1",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  const Element = as;
  return (
    <Element
      className={cn(
        "py-6 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-5xl sm:leading-[3.5rem] dark:text-white",
        className
      )}
    >
      {children}
    </Element>
  );
}
