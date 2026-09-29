import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeAiMarkdown } from "@/lib/ai/sanitize";

/**
 * Render Markdown keluaran model. `sanitizeAiMarkdown` murni manipulasi string,
 * jadi komponen ini aman dipakai dari client component (chat) maupun server.
 */
export function Markdown({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-neutral text-foreground prose-headings:tracking-tight prose-p:leading-7 prose-li:leading-7 max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {sanitizeAiMarkdown(markdown)}
      </ReactMarkdown>
    </div>
  );
}
