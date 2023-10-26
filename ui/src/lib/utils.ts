import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistance } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadText(title: string, data: string) {
  const blob = new Blob([data], {
    type: "text/markdown",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = title;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function formatFileSize(fileSize: number): string {
  const units: string[] = ["bytes", "KB", "MB", "GB", "TB"];
  let size: number = fileSize;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return (num / 1000000).toFixed(1) + "m";
  }
}

export const formatDate = (date: string, currentDate: string) => {
  return formatDistance(new Date(date), new Date(currentDate), {
    addSuffix: false,
  }).replace("about ", "");
};
