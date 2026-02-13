import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/data/newsData";
import RichText from "@/components/RichText";

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  apiResponse?: ApiResponse;
  userQuery?: string;
}

interface ChatbotProps {
  initialArticle?: NewsArticle | null;
  onClearArticle?: () => void;
}

type ApiItem = {
  domain?: string;
  id?: string;
  references?: string[];
  score?: number;
  summary?: string;
  title?: string;
  topic?: string;
};

type ApiResponse = {
  type?: string;
  message?: string;
  confidence?: number;
  kb_confidence?: number;
  intent?: string;
  domain?: string;
  graph_error?: string;
  items?: ApiItem[];
};

type InterestingFact = {
  fact_id?: string;
  details?: string;
};

type TimelineEvent = {
  order?: number;
  short_details?: string;
  time?: string;
};

const SUGGESTIONS: string[] = [
  "What are today's top stories?",
  "Summarize politics news",
  "Find related stories about the economy",
];

const API_URL = "http://127.0.0.1:5000/api/query";
const FACTS_API_URL = "http://localhost:5000/api/interesting-facts";
const TIMELINE_API_URL = "http://localhost:5000/api/timeline";

const pct = (v: number | undefined | null) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const n = Math.max(0, Math.min(1, v));
  return `${Math.round(n * 100)}%`;
};

const ApiResultView = ({ data }: { data: ApiResponse }) => {
  const items = Array.isArray(data.items) ? data.items : [];
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Right-panel subviews
  const [panelView, setPanelView] = useState<"details" | "facts" | "timeline">("details");
  const [facts, setFacts] = useState<InterestingFact[]>([]);
  const [factsLoading, setFactsLoading] = useState(false);
  const [factsError, setFactsError] = useState<string>("");

  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string>("");

  const selected = selectedId ? items.find((x) => x.id === selectedId) : null;

  // If the backend classified the user's query domain (and it isn't "Other"),
  // show only headlines from the same domain for better consistency.
  const queryDomain = (data.domain || "").trim().toLowerCase();
  const domainFiltered =
    queryDomain && queryDomain !== "other"
      ? items.filter((it) => (it.domain || "").trim().toLowerCase() === queryDomain)
      : items;
  const headlineItems = (domainFiltered.length > 0 ? domainFiltered : items).slice(0, 3);

  const onSelect = (it: ApiItem) => {
    if (!it?.id) return;
    setSelectedId(it.id);
    setPanelOpen(true);
    setPanelView("details");
  };

  const fetchInterestingFacts = async (topic: string) => {
    setFactsError("");
    setFactsLoading(true);
    try {
      const res = await fetch(FACTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API error (${res.status}): ${text || res.statusText}`);
      }

      const json = (await res.json()) as InterestingFact[];
      setFacts(Array.isArray(json) ? json : []);
      setPanelView("facts");
    } catch (e: any) {
      setFacts([]);
      setPanelView("facts");
      setFactsError(e?.message || "Failed to load interesting facts.");
    } finally {
      setFactsLoading(false);
    }
  };

  const fetchTimeline = async (title: string, summary: string, topic: string) => {
    setTimelineError("");
    setTimelineLoading(true);
    try {
      const res = await fetch(TIMELINE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, topic }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API error (${res.status}): ${text || res.statusText}`);
      }

      const json = (await res.json()) as TimelineEvent[];
      const arr = Array.isArray(json) ? json : [];
      // Keep a stable order (prefer server 'order', fallback to time)
      const sorted = [...arr].sort((a, b) => {
        const ao = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
        const bo = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        const at = a.time ? new Date(a.time).getTime() : Number.MAX_SAFE_INTEGER;
        const bt = b.time ? new Date(b.time).getTime() : Number.MAX_SAFE_INTEGER;
        return at - bt;
      });

      setTimeline(sorted);
      setPanelView("timeline");
    } catch (e: any) {
      setTimeline([]);
      setPanelView("timeline");
      setTimelineError(e?.message || "Failed to load timeline.");
    } finally {
      setTimelineLoading(false);
    }
  };

  const fullArticleUrl = (id?: string) => {
    if (!id) return "";
    // Open the article inside the frontend (new tab). The page will fetch JSON from the backend.
    return `/article-json/${encodeURIComponent(id)}`;
  };
  const formatTimelineTime = (t?: string) => {
    if (!t) return "—";
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return t;
    // Keep it compact but readable
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  return (
    <div className="w-full">
      <div className="flex gap-4 items-stretch">
        {/* Main content */}
        <div className="flex-1 min-w-0 bg-background border border-chatbot-border rounded-xl p-4">
          <div className="text-sm whitespace-pre-wrap leading-relaxed">{data.message || ""}</div>

          {headlineItems.length > 0 && (
            <>
              <div className="mt-4 pt-4 border-t border-chatbot-border text-xs text-muted-foreground">
                Want to know more? Click any headline below to view the article summary.
              </div>

              <div className="mt-2">
                {headlineItems.map((it) => (
                  <button
                    key={it.id || it.title}
                    type="button"
                    onClick={() => onSelect(it)}
                    className="block w-full text-left py-3 text-primary font-semibold hover:underline border-t border-chatbot-border first:border-t-0"
                  >
                    {it.title || "Untitled"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right collapsible panel */}
        <div
          className={
            "bg-background border border-chatbot-border rounded-xl overflow-hidden transition-all duration-200 " +
            (panelOpen ? "w-[38%] min-w-[320px]" : "w-0 border-transparent")
          }
        >
          <div className={panelOpen ? "flex flex-col h-full" : "hidden"}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-chatbot-border">
              <div className="font-semibold text-sm truncate pr-2">
                {panelView === "facts" ? "Interesting Facts" : selected?.title || "Article"}
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="p-1 rounded hover:bg-muted transition-colors"
                aria-label="Close article panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {!selected ? (
                <div className="text-sm text-muted-foreground">Select a headline to view details.</div>
              ) : (
                <>
                  {panelView === "facts" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => setPanelView("details")}
                        >
                          Back
                        </Button>
                        <div className="text-xs text-muted-foreground truncate">
                          Topic: <span className="text-foreground font-medium">{selected.topic || "—"}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        {factsLoading ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading facts...
                          </div>
                        ) : factsError ? (
                          <div className="text-sm text-destructive">{factsError}</div>
                        ) : facts.length === 0 ? (
                          <div className="text-sm text-muted-foreground">No facts found.</div>
                        ) : (
                          <ul className="list-disc pl-5 space-y-3 text-sm">
                            {facts.map((f, idx) => (
                              <li key={f.fact_id || idx} className="leading-relaxed">
                                {f.details || ""}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  ) : panelView === "timeline" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => setPanelView("details")}
                        >
                          Back
                        </Button>
                        <div className="text-xs text-muted-foreground truncate">
                          Topic: <span className="text-foreground font-medium">{selected.topic || "—"}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        {timelineLoading ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" /> Building timeline...
                          </div>
                        ) : timelineError ? (
                          <div className="text-sm text-destructive">{timelineError}</div>
                        ) : timeline.length === 0 ? (
                          <div className="text-sm text-muted-foreground">No timeline events found.</div>
                        ) : (
                          <ol className="relative border-l border-chatbot-border ml-2">
                            {timeline.map((ev, idx) => (
                              <li key={(ev.order ?? idx).toString()} className="mb-6 ml-4">
                                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-primary shadow-sm" />
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-[11px] font-semibold text-muted-foreground">
                                    {formatTimelineTime(ev.time)}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">#{ev.order ?? idx + 1}</div>
                                </div>
                                <div className="mt-1 text-sm leading-relaxed">{ev.short_details || ""}</div>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-medium text-foreground">Topic:</span> {selected.topic || "—"}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[11px]"
                            onClick={() => fetchInterestingFacts(selected.topic || "")}
                            disabled={!selected.topic || factsLoading}
                          >
                            Interesting Facts
                          </Button>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Domain:</span> {selected.domain || "—"}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Key Highlights
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[11px]"
                            onClick={() =>
                              fetchTimeline(selected.title || "", selected.summary || "", selected.topic || "")
                            }
                            disabled={timelineLoading || !selected.topic}
                          >
                            Timeline View
                          </Button>
                        </div>
                        <div className="mt-2 text-sm whitespace-pre-wrap leading-relaxed">
                          {selected.summary || ""}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mt-2">
                          <a
                            href={fullArticleUrl(selected.id)}
                            target="_blank"
                            rel="noreferrer"
                            className={
                              "inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium border " +
                              (selected.id
                                ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                                : "bg-muted text-muted-foreground border-chatbot-border pointer-events-none")
                            }
                          >
                            Read
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chatbot = ({ initialArticle, onClearArticle }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialArticle && isOpen) {
      handleArticleContext(initialArticle);
      onClearArticle?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialArticle, isOpen]);

  useEffect(() => {
    if (initialArticle) setIsOpen(true);
  }, [initialArticle]);

  const callBackend = async (userMessage: string): Promise<ApiResponse> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API error (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as ApiResponse;
  };

  const sendUserMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await callBackend(trimmed);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        apiResponse: data,
        userQuery: trimmed,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          `## Sorry — I couldn't reach the backend\n\n` +
          `**Request:** POST ${API_URL}\n\n` +
          `**Error:** ${err?.message || String(err)}\n\n` +
          `Please verify the backend is running and CORS is enabled (if the UI is on a different port).`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleContext = async (article: NewsArticle) => {
    // Keep the existing behavior (opening chatbot from an article),
    // but route through the backend API.
    const q = `Tell me about this article: "${article.title}"`;
    await sendUserMessage(q);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const q = input;
    setInput("");
    await sendUserMessage(q);
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 26 }}
            className="chatbot-window"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Research Copilot</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground pt-2">
                    <div className="text-2xl font-semibold text-foreground">Good morning</div>
                    <div className="text-sm mt-1">Ask us about today's news.</div>
                  </div>

                  <div className="border-b border-chatbot-border">
                    <div className="flex gap-6 text-sm font-medium">
                      <div className="pb-2 border-b-2 border-primary text-foreground">Today's news</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendUserMessage(s)}
                        className="w-full text-left px-3 py-3 rounded-md border border-chatbot-border hover:bg-muted transition-colors"
                      >
                        <span className="text-sm">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "user" ? "chatbot-message-user" : "chatbot-message-bot"}
                >
                  {message.role === "assistant" ? (
                    message.apiResponse ? (
                      <ApiResultView data={message.apiResponse} />
                    ) : (
                      <div className="prose prose-sm max-w-none text-sm">
                        <RichText className="prose prose-sm max-w-none dark:prose-invert">
                          {message.content || ""}
                        </RichText>
                      </div>
                    )
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="chatbot-message-bot">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-chatbot-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the news..."
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-fab"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
