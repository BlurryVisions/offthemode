"use client";
import { useState } from "react";

/** One copyable value: shows it, copies it, says so. Falls back to selecting the text when the clipboard is refused. */
export function Copy({ text, block = false, label }: { text: string; block?: boolean; label: string }) {
  const [done, setDone] = useState(false);
  const onCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {
      const el = e.currentTarget.parentElement?.querySelector("code, pre");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };
  return (
    <div className="field">
      {block ? <pre>{text}</pre> : <code>{text}</code>}
      <button className="copy" type="button" onClick={onCopy} data-done={done} aria-label={`Copy ${label}`}>
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
