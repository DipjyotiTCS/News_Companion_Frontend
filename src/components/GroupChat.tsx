import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Users, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NewsArticle } from "@/data/newsData";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

const SIMULATED_USERS = [
  { name: "Alex R.", avatar: "AR", color: "bg-blue-500" },
  { name: "Priya M.", avatar: "PM", color: "bg-emerald-500" },
  { name: "Jordan K.", avatar: "JK", color: "bg-amber-500" },
  { name: "Sam L.", avatar: "SL", color: "bg-violet-500" },
  { name: "Casey T.", avatar: "CT", color: "bg-rose-500" },
];

const generateInitialMessages = (article: NewsArticle): ChatMessage[] => [
  {
    id: "1",
    user: "Alex R.",
    avatar: "AR",
    content: `Just read this article about ${article.category.toLowerCase()} — really interesting developments!`,
    timestamp: "2 min ago",
  },
  {
    id: "2",
    user: "Priya M.",
    avatar: "PM",
    content: "I agree. The implications are huge if this plays out as described.",
    timestamp: "1 min ago",
  },
  {
    id: "3",
    user: "Jordan K.",
    avatar: "JK",
    content: "Does anyone know more background on this? I'd love a deeper dive.",
    timestamp: "just now",
  },
];

const SIMULATED_RESPONSES = [
  "That's a really good point! I hadn't considered that angle.",
  "I think the long-term impact will be even bigger than what's reported here.",
  "Has anyone seen the follow-up coverage on this?",
  "This could reshape the entire industry, honestly.",
  "I'm cautiously optimistic. Let's see how things unfold.",
  "Great discussion everyone! Really learning a lot from different perspectives.",
  "The data backing this is quite compelling if you look at the source studies.",
  "I wonder how this compares to similar situations in other countries.",
];

interface GroupChatProps {
  article: NewsArticle;
}

const GroupChat = ({ article }: GroupChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    generateInitialMessages(article)
  );
  const [inputValue, setInputValue] = useState("");
  const [onlineCount] = useState(Math.floor(Math.random() * 12) + 5);
  const scrollRef = useRef<HTMLDivElement>(null);
  const responseIndexRef = useRef(0);

  // Simulate incoming messages
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
      const content = SIMULATED_RESPONSES[responseIndexRef.current % SIMULATED_RESPONSES.length];
      responseIndexRef.current++;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          user: user.name,
          avatar: user.avatar,
          content,
          timestamp: "just now",
        },
      ]);
    }, 8000 + Math.random() * 7000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: "You",
        avatar: "YO",
        content: inputValue,
        timestamp: "just now",
        isCurrentUser: true,
      },
    ]);
    setInputValue("");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2"
        variant="outline"
      >
        <MessageSquare className="w-4 h-4" />
        Discussion on Topic
        <Badge variant="secondary" className="ml-1 text-xs">
          Live
        </Badge>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
              style={{ height: "70vh", maxHeight: 600 }}
            >
              {/* Header */}
              <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Group Discussion
                  </h3>
                  <p className="text-xs opacity-80 mt-0.5 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                    {onlineCount} people online
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Topic Banner */}
              <div className="bg-muted px-4 py-2 border-b text-xs text-muted-foreground shrink-0">
                📰 Discussing: <span className="font-medium text-foreground">{article.title.slice(0, 60)}...</span>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${msg.isCurrentUser ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className={`text-xs text-white ${
                          msg.isCurrentUser ? "bg-primary" : "bg-muted-foreground"
                        }`}>
                          {msg.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[75%] ${msg.isCurrentUser ? "text-right" : ""}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium">{msg.user}</span>
                          <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                        </div>
                        <div
                          className={`rounded-lg px-3 py-2 text-sm inline-block ${
                            msg.isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-3 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Join the discussion..."
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GroupChat;
