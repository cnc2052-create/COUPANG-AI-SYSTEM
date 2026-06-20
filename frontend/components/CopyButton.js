"use client";

export default function CopyButton({ value, label = "복사" }) {
  async function copy() {
    await navigator.clipboard.writeText(value || "");
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="h-9 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
    >
      {label}
    </button>
  );
}
