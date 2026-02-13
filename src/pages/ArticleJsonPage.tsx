import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Tag,
  TrendingUp,
  User,
  Loader2,
  X, 
  Share2, 
  Bookmark
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import RichText from "@/components/RichText";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import GroupChat from "@/components/GroupChat";
import LivePodcast from "@/components/LivePodcast";
import { Separator } from "@/components/ui/separator";

type ArticleJson = {
  title?: string;
  author?: string;
  body?: string;
  country?: string;
  date?: string;
  description?: string;
  domain?: string;
  location?: string;
  reference1?: string;
  reference2?: string;
  references?: string[];
  summary?: string;
  summery?: string;
  topic?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type LongformAnalysis = {
  future_outlook?: string;
  historical_context?: string;
  impact_analysis?: string;
  what_happened?: string;
  why_it_matters?: string;
};

type LongformSection = {
  key: keyof LongformAnalysis;
  label: string;
};

const LONGFORM_SECTIONS: LongformSection[] = [
  { key: "what_happened", label: "Event" },
  { key: "why_it_matters", label: "Why Its Important" },
  { key: "historical_context", label: "Historical Context" },
  { key: "impact_analysis", label: "Impact on General Public" },
  { key: "future_outlook", label: "Whats Next" },
];

const BACKEND_BASE = "http://127.0.0.1:5000";

export default function ArticleJsonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ArticleJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"summary" | "keywords" | "future" | "chat">("summary");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [longform, setLongform] = useState<LongformAnalysis | null>(null);
  const [longformLoading, setLongformLoading] = useState(false);
  const [longformError, setLongformError] = useState("");
  const [longformForId, setLongformForId] = useState<string>("");
  const [article, setArticle] = useState<null | null>(null);


  const articleId = useMemo(() => (id ? decodeURIComponent(id) : ""), [id]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BACKEND_BASE}/article_json/${encodeURIComponent(articleId)}`);
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(`API error (${res.status}): ${t || res.statusText}`);
        }
        const json = (await res.json()) as ArticleJson;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load article.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, articleId]);

  // Prefer the real article title; fall back to topic if backend doesn't provide title.
  const headline = data?.title || data?.topic || "News Article";

  const aiSummary = useMemo(() => {
    const raw = (data?.summary || data?.summery || "").trim();
    if (raw) return raw;
    // If backend didn't send summary, fall back to description as the insight summary.
    return (data?.description || "").trim();
  }, [data]);



// Reset longform analysis when the article changes.
useEffect(() => {
  setLongform(null);
  setLongformError("");
  setLongformLoading(false);
  setLongformForId(articleId);
}, [articleId]);

// Fetch longform analysis only when the user opens the Future tab.
useEffect(() => {
  const controller = new AbortController();

  async function fetchLongform() {
    if (activeTab !== "future") return;
    if (!data) return;

    // Prevent duplicate fetches while one is in-flight.
    if (longformLoading) return;

    // Avoid refetching if we already have analysis for the current article id.
    if (longform && longformForId === articleId) return;

    setLongformLoading(true);
    setLongformError("");

    try {
      const payload = {
        title: headline,
        description: (data.description || aiSummary || "").trim(),
        topic: (data.topic || "").trim(),
      };

      const res = await fetch(`${BACKEND_BASE}/api/longform-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`API error (${res.status}): ${t || res.statusText}`);
      }

      const json = (await res.json()) as LongformAnalysis;
      setLongform(json);
      setLongformForId(articleId);
    } catch (e: any) {
      // Ignore abort errors (happens if user switches tabs quickly)
      if (e?.name === "AbortError") return;
      setLongformError(e?.message || "Failed to load longform analysis.");
    } finally {
      setLongformLoading(false);
    }
  }

  fetchLongform();

  return () => {
    controller.abort();
  };
  // IMPORTANT: Don't depend on longformLoading here. Setting longformLoading(true)
  // triggers a re-render; if we depended on longformLoading, React would re-run this
  // effect and abort the in-flight request before it can update state.
}, [activeTab, data, headline, aiSummary, articleId, longform, longformForId]);

  const sources = useMemo(() => {
    const list: string[] = [];
    if (data?.reference1) list.push(data.reference1);
    if (data?.reference2) list.push(data.reference2);
    (data?.references || []).forEach((r) => {
      if (r && !list.includes(r)) list.push(r);
    });
    return list.slice(0, 2);
  }, [data]);

  const keywords = useMemo(() => {
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "as",
      "is",
      "was",
      "are",
      "were",
      "been",
      "be",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "shall",
      "can",
      "that",
      "this",
      "these",
      "those",
      "it",
      "its",
      "they",
      "their",
      "them",
      "we",
      "our",
      "you",
      "your",
      "he",
      "she",
      "his",
      "her",
      "him",
      "who",
      "what",
      "which",
      "when",
      "where",
      "why",
      "how",
      "all",
      "each",
      "every",
      "both",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "just",
      "also",
    ]);

    const text = `${headline} ${data?.topic || ""} ${data?.body || ""}`
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w));

    const freq: Record<string, number> = {};
    for (const w of text) freq[w] = (freq[w] || 0) + 1;
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
  }, [data, headline]);

  const futureScope = useMemo(() => {
    const domain = (data?.domain || "").toLowerCase();
    const topic = (data?.topic || "").toLowerCase();
    const pick = (items: string[]) => items;

    if (domain.includes("tech") || topic.includes("ai") || topic.includes("technology")) {
      return pick([
        "Expect faster iteration as products integrate more automation and personalization.",
        "Regulatory and privacy discussions may intensify as adoption expands.",
        "Competition could shift toward better trust, transparency, and model governance.",
        "New roles and skills may emerge around AI operations, evaluation, and safety.",
      ]);
    }

    if (domain.includes("business") || domain.includes("finance") || topic.includes("market")) {
      return pick([
        "Near-term volatility may continue as investors digest new information.",
        "Companies could adjust strategy, pricing, or hiring in response to trends.",
        "Supply chains and consumer behavior may normalize unevenly across regions.",
        "Watch for second-order impacts in adjacent industries and policy responses.",
      ]);
    }

    if (domain.includes("polit") || topic.includes("election") || topic.includes("policy")) {
      return pick([
        "Expect follow-on statements, amendments, or negotiations as stakeholders react.",
        "Public sentiment and media framing may influence the next decision cycle.",
        "Implementation details will likely determine real-world outcomes.",
        "Related legislation or executive actions could accelerate in the coming weeks.",
      ]);
    }

    return pick([
      "This story may continue evolving as new facts and responses emerge.",
      "Stakeholders will likely clarify positions and adjust strategies over time.",
      "Secondary impacts could appear in related sectors and local communities.",
      "Keep an eye on follow-up reporting and official data releases.",
    ]);
  }, [data]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isChatLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsChatLoading(true);

    // Lightweight local "AI" response (demo) using article context.
    setTimeout(() => {
      const q = userMessage.content.toLowerCase();
      let response = `Based on **${headline}**:\n\n${aiSummary || "(No summary provided.)"}`;

      if (q.includes("source") || q.includes("reference")) {
        response = `Here are the sources I have for this page:\n\n${sources
          .map((s, i) => `${i + 1}. ${s}`)
          .join("\n") || "(No sources provided.)"}`;
      } else if (q.includes("keyword") || q.includes("topic") || q.includes("main")) {
        response = `**Key topics/keywords:**\n\n${keywords.slice(0, 8).map((k) => `• ${k}`).join("\n") || "(No keywords.)"}`;
      } else if (q.includes("future") || q.includes("impact") || q.includes("implication")) {
        response = `**Potential implications:**\n\n${futureScope.map((x) => `• ${x}`).join("\n")}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsChatLoading(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCategoryChange={() => navigate("/")} selectedCategory="All" onSearch={() => navigate("/")} />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">Loading article…</div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
              {/* Hero image (demo asset to keep theme consistent) */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                <img src="/demo-hero.jpg" alt={headline} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {data?.domain && <Badge className="absolute bottom-4 left-4 category-badge">{data.domain}</Badge>}
              </div>

              {/* Header */}
              <header className="mb-6">
                <h1 className="headline text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{headline}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-5">
                  {data?.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {data.author}
                    </span>
                  )}
                  {data?.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {data.date}
                    </span>
                  )}
                  {(data?.location || data?.country) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {[data.location, data.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-5">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
              </header>

              <Separator className="my-6" />

              {/* Body */}
              {data?.body && (
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {data.body.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {/* Sources */}
              {sources.length > 0 && (
                <div className="mt-10 rounded-lg border border-border p-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sources</div>
                  <ul className="space-y-2">
                    {sources.map((s) => (
                      <li key={s}>
                        <a className="text-sm text-primary hover:underline break-all" href={s} target="_blank" rel="noreferrer">
                          {s}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Debug / convenience for verifying correct article id */}
              {articleId && <div className="mt-6 text-xs text-muted-foreground">Article ID: {articleId}</div>}
            </motion.article>

            {/* AI Sidebar */}
            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-1">
              <Card className="sticky top-4 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Insights
                  </CardTitle>
                </CardHeader>

                {/* Tab Navigation */}
                <div className="flex border-b">
                  {[
                    { id: "summary", label: "Summary", icon: Sparkles },
                    { id: "keywords", label: "Keywords", icon: Tag },
                    { id: "future", label: "Analyse", icon: TrendingUp },
                    { id: "chat", label: "Chat", icon: MessageCircle },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 py-3 px-2 text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <CardContent className="p-0">
                  <AnimatePresence mode="wait">
                    {/* Summary Tab */}
                    {activeTab === "summary" && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4"
                      >
                        <h4 className="font-semibold mb-3 text-sm">Summary</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {aiSummary || "No summary available for this article."}
                        </p>
                      </motion.div>
                    )}

                    {/* Keywords Tab */}
                    {activeTab === "keywords" && (
                      <motion.div
                        key="keywords"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4"
                      >
                        <h4 className="font-semibold mb-3 text-sm">Key Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {keywords.length ? (
                            keywords.map((k) => (
                              <Badge key={k} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                                {k}
                              </Badge>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No keywords available.</div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Future Scope Tab */}
{activeTab === "future" && (
  <motion.div
    key="future"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="p-4"
  >
    <h4 className="font-semibold mb-3 text-sm">Analysis</h4>

    {longformLoading && (
      <div className="rounded-lg border p-3 text-sm bg-muted/40 text-muted-foreground flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading analysis…
      </div>
    )}

    {!longformLoading && longformError && (
      <div className="rounded-lg border p-3 text-sm bg-muted/40">
        <div className="text-sm text-destructive mb-2">{longformError}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLongform(null);
            setLongformError("");
            setLongformLoading(false);
            // Trigger the effect again by "re-opening" the tab state.
            setActiveTab("summary");
            setTimeout(() => setActiveTab("future"), 0);
          }}
        >
          Retry
        </Button>
      </div>
    )}

    {!longformLoading && !longformError && longform && (
      <div className="space-y-4">
        {LONGFORM_SECTIONS.map((section) => {
          const value = String(longform[section.key] || "").trim();
          if (!value) return null;
          return (
            <div key={section.key} className="rounded-lg border border-border p-3 bg-background">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {section.label}
              </div>
              <RichText className="prose prose-sm max-w-none dark:prose-invert text-sm">
                {value}
              </RichText>
            </div>
          );
        })}
      </div>
    )}

    {!longformLoading && !longformError && !longform && (
      <div className="text-sm text-muted-foreground">
        Open this tab to load longform analysis.
      </div>
    )}
  </motion.div>
)}


                    {/* Chat Tab */}
                    {activeTab === "chat" && (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4"
                      >
                        <div className="space-y-3 mb-3">
                          {messages.length === 0 && (
                            <div className="text-xs text-muted-foreground">
                              Ask about summary, keywords, impacts, or sources.
                            </div>
                          )}
                          {messages.map((m) => (
                            <div
                              key={m.id}
                              className={`rounded-lg border p-3 text-sm ${m.role === "assistant" ? "bg-muted/40" : "bg-background"}`}
                            >
                              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                {m.role === "assistant" ? "AI" : "You"}
                              </div>
                              <RichText className="prose prose-sm max-w-none dark:prose-invert">{m.content}</RichText>
                            </div>
                          ))}

                          {isChatLoading && (
                            <div className="rounded-lg border p-3 text-sm bg-muted/40 text-muted-foreground flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Thinking…
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSendMessage();
                            }}
                            placeholder="Ask a question…"
                          />
                          <Button onClick={handleSendMessage} disabled={isChatLoading || !inputValue.trim()} className="gap-2">
                            <Send className="w-4 h-4" />
                            Send
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
