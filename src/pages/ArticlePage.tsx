import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, Clock, User, Calendar, Sparkles, MessageCircle, Tag, TrendingUp, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RichText from "@/components/RichText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { newsArticles, NewsArticle } from "@/data/newsData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "keywords" | "future" | "chat">("summary");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const foundArticle = newsArticles.find((a) => a.id === id);
    setArticle(foundArticle || null);
    
    // Reset chat when article changes
    setMessages([]);
    setActiveTab("summary");
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Article Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Generate summary from article content
  const generateSummary = () => {
    const sentences = article.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPoints = sentences.slice(0, 4).map(s => s.trim());
    return keyPoints;
  };

  // Extract keywords from article
  const extractKeywords = () => {
    const stopWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "that", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "you", "your", "he", "she", "his", "her", "him", "who", "what", "which", "when", "where", "why", "how", "all", "each", "every", "both", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "also"];
    
    const words = (article.title + " " + article.content)
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  };

  // Generate future scope/implications
  const generateFutureScope = () => {
    const categoryImplications: Record<string, string[]> = {
      "Environment": [
        "Policy implementation across participating nations will require significant infrastructure investments",
        "Renewable energy sectors may see accelerated growth and job creation",
        "Carbon markets could emerge as major financial instruments",
        "International cooperation mechanisms will need strengthening"
      ],
      "Technology": [
        "Market dynamics may shift toward more decentralized platforms",
        "Innovation in privacy-preserving technologies could accelerate",
        "Smaller tech companies may find new competitive opportunities",
        "Consumer data rights awareness will likely increase"
      ],
      "Business": [
        "Investment strategies may need recalibration based on new economic conditions",
        "Corporate planning horizons might extend with improved market stability",
        "Cross-sector impacts could create unexpected opportunities",
        "Workforce dynamics may shift in response to policy changes"
      ],
      "Health": [
        "Treatment protocols could evolve significantly within the next decade",
        "Research funding priorities may shift toward translational applications",
        "Patient outcomes could improve with new therapeutic approaches",
        "Healthcare costs may be impacted by new treatment availability"
      ],
      "default": [
        "This development could have far-reaching implications across multiple sectors",
        "Stakeholders should monitor ongoing developments closely",
        "Related policy discussions may intensify in coming months",
        "Public engagement on this topic is likely to increase"
      ]
    };

    return categoryImplications[article.category] || categoryImplications["default"];
  };

  // Handle chat with article context
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response based on article context
    setTimeout(() => {
      const response = generateContextualResponse(inputValue, article);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateContextualResponse = (query: string, article: NewsArticle): string => {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes("summary") || queryLower.includes("summarize") || queryLower.includes("about")) {
      return `**Article Summary:**\n\n${article.excerpt}\n\nThis article by ${article.author} covers key developments in the ${article.category.toLowerCase()} sector. The main points discussed include the implications and potential outcomes of the events described.`;
    }
    
    if (queryLower.includes("author") || queryLower.includes("who wrote")) {
      return `This article was written by **${article.author}** and was published ${article.publishedAt}. The estimated reading time is ${article.readTime} minutes.`;
    }
    
    if (queryLower.includes("impact") || queryLower.includes("effect") || queryLower.includes("consequence")) {
      return `**Potential Impacts:**\n\nBased on the article content, the key impacts include:\n\n1. **Immediate effects:** The developments described will likely have short-term implications for stakeholders in the ${article.category.toLowerCase()} sector.\n\n2. **Long-term implications:** The broader consequences may reshape how related industries and communities operate.\n\n3. **Stakeholder response:** Various groups are expected to adapt their strategies in response to these changes.`;
    }
    
    if (queryLower.includes("related") || queryLower.includes("similar") || queryLower.includes("more")) {
      const relatedArticles = newsArticles
        .filter(a => a.id !== article.id && a.category === article.category)
        .slice(0, 3);
      
      if (relatedArticles.length > 0) {
        return `**Related Articles in ${article.category}:**\n\n${relatedArticles.map((a, i) => `${i + 1}. **${a.title}** - ${a.excerpt.slice(0, 80)}...`).join("\n\n")}`;
      }
      return `I couldn't find other articles in the ${article.category} category at this time.`;
    }
    
    if (queryLower.includes("keyword") || queryLower.includes("key term") || queryLower.includes("main topic")) {
      const keywords = extractKeywords().slice(0, 5);
      return `**Key Topics in this Article:**\n\n${keywords.map(k => `• ${k}`).join("\n")}\n\nThese terms represent the core themes discussed in this ${article.category.toLowerCase()} piece.`;
    }

    // Default contextual response
    return `Based on the article "${article.title}":\n\n${article.excerpt}\n\nThe piece by ${article.author} explores important developments in ${article.category.toLowerCase()}. Would you like me to provide more specific information about any aspect of this story? I can discuss:\n\n• **Summary** - Key points and takeaways\n• **Impact** - Potential effects and implications\n• **Related content** - Similar articles on this topic\n• **Keywords** - Main terms and concepts`;
  };

  const summary = generateSummary();
  const keywords = extractKeywords();
  const futureScope = generateFutureScope();

  const relatedArticles = newsArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCategoryChange={() => navigate("/")}
        selectedCategory="All"
        onSearch={() => navigate("/")}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Headlines
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Hero Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <Badge className="absolute bottom-4 left-4 category-badge">
                {article.category}
              </Badge>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="headline text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTime} min read
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
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

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-xl font-medium text-foreground mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-12 pt-8 border-t border-divider">
                <h2 className="text-xl font-bold mb-6">More in {article.category}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      to={`/article/${related.id}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={related.imageUrl}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-2">
                            {related.readTime} min read
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </motion.article>

          {/* AI Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
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
                      <h4 className="font-semibold mb-3 text-sm">Key Points</h4>
                      <ul className="space-y-3">
                        {summary.map((point, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                              {index + 1}
                            </span>
                            <span>{point}.</span>
                          </li>
                        ))}
                      </ul>
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
                        {keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {keyword}
                          </Badge>
                        ))}
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
                      <h4 className="font-semibold mb-3 text-sm">Future Implications</h4>
                      <ul className="space-y-3">
                        {futureScope.map((item, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-muted-foreground"
                          >
                            <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Chat Tab */}
                  {activeTab === "chat" && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col h-[400px]"
                    >
                      <ScrollArea className="flex-1 p-4">
                        {messages.length === 0 ? (
                          <div className="text-center text-muted-foreground text-sm py-8">
                            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Ask me anything about this article!</p>
                            <div className="mt-4 space-y-2">
                              {[
                                "Summarize this article",
                                "What's the main impact?",
                                "Find related articles",
                              ].map((suggestion) => (
                                <button
                                  key={suggestion}
                                  onClick={() => {
                                    setInputValue(suggestion);
                                  }}
                                  className="block w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-xs transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${
                                  message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                                    message.role === "user"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {message.role === "assistant" ? (
                                    <div className="prose prose-sm max-w-none">
                                      <RichText className="prose prose-sm max-w-none dark:prose-invert">
                                        {message.content}
                                      </RichText>
                                    </div>
                                  ) : (
                                    message.content
                                  )}
                                </div>
                              </div>
                            ))}
                            {isLoading && (
                              <div className="flex justify-start">
                                <div className="bg-muted rounded-lg px-3 py-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </ScrollArea>

                      <div className="p-4 border-t">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                          }}
                          className="flex gap-2"
                        >
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about this article..."
                            className="flex-1 text-sm"
                          />
                          <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim() || isLoading}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
