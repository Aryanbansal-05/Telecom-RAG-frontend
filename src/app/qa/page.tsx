import { ChatInterface } from "@/components/qa/ChatInterface";

export const metadata = {
  title: "3GPP Q&A — Telecom RAG",
  description: "Ask questions about 3GPP standards grounded in TeleQnA knowledge with cited sources.",
};

export default function QAPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <ChatInterface />
    </div>
  );
}
