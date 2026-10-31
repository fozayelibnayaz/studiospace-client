export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const center = align === "center";
  return (
    <div className={`mb-10 md:mb-12 ${center ? "text-center mx-auto max-w-2xl" : ""}`}>
      {eyebrow && (
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          <span className="inline-block w-6 h-px bg-primary" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm md:text-base text-base-content/65 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
