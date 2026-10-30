import Link from "next/link";
import type { ComponentProps } from "react";

type Props = {
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentProps<"button">, "ref">;

/** Standard button / link button. Internal links use next/link; external ones open in a new tab. */
export default function Button({ href, variant = "primary", className = "", children, ...rest }: Props) {
  const cls = `btn btn-${variant} ${className}`;

  if (href) {
    const external = href.startsWith("http");
    return (
      <Link href={href} className={cls} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
