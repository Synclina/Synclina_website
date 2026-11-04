import { notFound } from "next/navigation";

/** Sends every unknown address to the site's own 404 page. */
export default function Missing() {
  notFound();
}
