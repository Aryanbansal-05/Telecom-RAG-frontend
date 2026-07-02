"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-sm max-w-none prose-telecom", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code rendering
          code({ className: codeClass, children, ...props }) {
            const isBlock = codeClass?.includes("language-");
            if (isBlock) {
              return (
                <pre className="overflow-x-auto rounded-lg p-3 my-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono">
                  <code className={codeClass} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded text-xs font-mono bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--border-color)]"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Ensure links open in new tab
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Style blockquotes as telecom spec references
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-2 border-[var(--accent)] pl-3 my-2 text-[var(--text-secondary)] italic"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
