import React from "react";

type RichTextProps = {
  children?: string | null;
  className?: string;
};

// Very small HTML allowlist sanitizer.
// This is intentionally lightweight (no external deps) and supports basic tags commonly returned by the backend.
const ALLOWED_TAGS = new Set([
  "p","br","hr","blockquote","ul","ol","li","b","strong","i","em","u","code","pre","span","a",
  "h1","h2","h3","h4","h5","h6"
]);

function sanitizeHtml(input: string): string {
  // Fast path: if it doesn't look like HTML, return as escaped text-ish later (handled by caller).
  // Here we still sanitize when asked explicitly.
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    const body = doc.body;

    const walk = (node: Node) => {
      // Remove comments
      if (node.nodeType === Node.COMMENT_NODE) {
        node.parentNode?.removeChild(node);
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tag)) {
          // Replace disallowed element with its text content
          const text = doc.createTextNode(el.textContent || "");
          el.parentNode?.replaceChild(text, el);
          return;
        }

        // Strip dangerous attributes
        // Allow only safe href/title on <a>, and force safe target/rel
        const attrs = Array.from(el.attributes);
        for (const a of attrs) {
          const name = a.name.toLowerCase();
          const value = a.value;

          const isEvent = name.startsWith("on");
          const isStyle = name === "style";
          if (isEvent || isStyle) {
            el.removeAttribute(a.name);
            continue;
          }

          if (tag === "a") {
            if (name === "href") {
              // Allow http(s), mailto, and relative links
              const v = (value || "").trim();
              const ok =
                v.startsWith("http://") ||
                v.startsWith("https://") ||
                v.startsWith("mailto:") ||
                v.startsWith("/") ||
                v.startsWith("#");
              if (!ok) el.removeAttribute("href");
            } else if (name === "title") {
              // keep
            } else if (name === "target" || name === "rel") {
              // we'll normalize below
            } else {
              el.removeAttribute(a.name);
            }
          } else if (tag === "span") {
            // allow nothing by default on span (class/style removed above)
            el.removeAttribute(a.name);
          } else {
            // Other allowed tags: drop all attributes
            el.removeAttribute(a.name);
          }
        }

        if (tag === "a") {
          // Normalize target/rel
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener noreferrer");
        }
      }

      // Walk children (copy list first in case of mutations)
      const children = Array.from(node.childNodes);
      for (const c of children) walk(c);
    };

    walk(body);
    return body.innerHTML || "";
  } catch {
    return "";
  }
}

function looksLikeHtml(s: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(s);
}

export default function RichText({ children, className }: RichTextProps) {
  const content = (children ?? "").toString();

  if (looksLikeHtml(content)) {
    const safe = sanitizeHtml(content);
    return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
  }

  // Plain text fallback with simple paragraph/line breaks.
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className={className}>
      {lines.map((l, idx) => (
        <p key={idx} className="mb-2 last:mb-0">
          {l}
        </p>
      ))}
    </div>
  );
}
