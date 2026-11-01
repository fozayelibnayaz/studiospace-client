export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  className = "",
}) {
  const center = align === "center";
  return (
    <div
      className={`mb-10 md:mb-12 flex flex-wrap items-end gap-6 ${
        center ? "flex-col items-center text-center" : "justify-between"
      } ${className}`}
    >
      <div className={center ? "max-w-2xl mx-auto" : "max-w-2xl"}>
        {eyebrow && (
          <p className={`eyebrow text-primary mb-4 ${center ? "justify-center" : ""}`}>
            {eyebrow}
          </p>
        )}
        <h2 className="display text-[1.75rem] sm:text-4xl md:text-[2.9rem] text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-muted max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
