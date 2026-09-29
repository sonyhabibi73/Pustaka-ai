import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeAiMarkdown } from "@/lib/ai/sanitize";

export function MarkdownSummary({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-neutral text-foreground prose-headings:tracking-tight prose-p:leading-7 max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {sanitizeAiMarkdown(markdown)}
      </ReactMarkdown>
    </div>
  );
}
