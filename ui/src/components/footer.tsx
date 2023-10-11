import { ModeToggle } from "./mode-toggle";

export default function Footer() {
  return (
    <footer className="py-6 md:py-0 border-t bg-white dark:bg-transparent">
      <div className="px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://twitter.com/_ahmadrosid"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            ahmadrosid
          </a>{" "}
          ©2023 All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            className="font-medium text-muted-foreground hover:underline hover:text-primary text-sm"
            href="/tools"
          >
            Free tools
          </a>
          <a
            className="font-medium text-muted-foreground hover:underline hover:text-primary text-sm"
            href="mailto:alahmadrosid@gmail.com"
          >
            Contact
          </a>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
