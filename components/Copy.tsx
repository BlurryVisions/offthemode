"use client";
import { useRef, useState } from "react";

type State = "idle" | "copied" | "selected";
const SAY: Record<State, (label: string) => string> = {
  idle: () => "",
  copied: (label) => `Copied ${label}`,
  selected: () => "Selected. Press Ctrl+C, or Cmd+C on a Mac, to copy it.",
};

/** One copyable value: shows it, copies it, and says so on screen and to screen readers.
 * When the clipboard is refused, it selects the text so it can be copied by hand. */
export function Copy({ text, block = false, label }: { text: string; block?: boolean; label: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const field = e.currentTarget.parentElement;
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      const el = field?.querySelector("code, pre");
      if (el) window.getSelection()?.selectAllChildren(el);
      setState("selected");
    }
    timer.current = setTimeout(() => setState("idle"), 2400);
  };
  return (
    <div className="field">
      {block ? <pre>{text}</pre> : <code>{text}</code>}
      <button className="copy" type="button" onClick={onCopy} data-done={state === "copied"}>
        {state === "copied" ? "Copied" : state === "selected" ? "Selected" : "Copy"}
        <span className="sr-only"> {label}</span>
      </button>
      {/* Always in the page, so screen readers announce each change. */}
      <span className="sr-only" role="status">{SAY[state](label)}</span>
    </div>
  );
}
