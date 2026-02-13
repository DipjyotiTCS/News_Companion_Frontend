import { X, Share2, Bookmark, MessageCircle } from "lucide-react";
import { NewsArticle } from "@/data/newsData";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onAskChatbot: (article: NewsArticle) => void;
}

const ArticleModal = ({ article, onClose, onAskChatbot }: ArticleModalProps) => {
  if (!article) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25 }}
          className="max-w-3xl mx-auto my-8 bg-background rounded-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header image */}
          <div className="relative h-64 sm:h-80">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="category-badge">{article.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <h1 className="headline text-2xl sm:text-3xl font-bold mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-divider">
              <span className="font-medium text-foreground">{article.author}</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-6">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2"
                onClick={() => onAskChatbot(article)}
              >
                <MessageCircle className="w-4 h-4" />
                Ask AI about this
              </Button>
            </div>

            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg font-medium text-foreground mb-4">
                {article.excerpt}
              </p>
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleModal;
