import { twMerge } from "tailwind-merge";

export default function Shimmer(props: { className?: string }) {
  return (
    <div
      className={twMerge(
        "w-full h-full before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:animate-shimmer rounded-xl relative before:absolute before:inset-0 overflow-hidden",
        props.className
      )}
    />
  );
}
