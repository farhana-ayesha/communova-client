import { cn } from "@/lib/utils";

type AvatarUser = {
  name?: string | null;
  image?: string | null;
};

const sizes = {
  sm: "size-8 text-[13px]",
  md: "size-10 text-[15px]",
  lg: "size-16 text-[22px]",
  xl: "size-24 text-[30px]",
} as const;

function initials(name?: string | null) {
  if (!name) return "C";

  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "C";
}

/**
 * Circles are reserved for avatars in this system. Remote photo URLs are
 * rendered as-is; when absent or broken, the member's initials carry the mark.
 */
function Avatar({
  user,
  size = "md",
  className,
}: {
  user: AvatarUser;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const label = user.name?.trim() || "Communova member";
  const src = user.image?.trim();

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-bark bg-sand font-serif text-ink",
        sizes[size],
        className,
      )}
    >
      {src ? (
        // Arbitrary member-supplied hosts cannot be enumerated in next.config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          className="size-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        <span aria-hidden>{initials(user.name)}</span>
      )}
    </span>
  );
}

export { Avatar };
