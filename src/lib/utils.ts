import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAnonymousId() {
  const key = "anonymous_id";
  let id = localStorage.getItem(key);

  if (!id) {
    id = crypto.randomUUID(); // Gera um novo UUID
    localStorage.setItem(key, id);
  }

  return id;
}
