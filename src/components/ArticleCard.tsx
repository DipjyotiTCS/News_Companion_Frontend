import { Link } from "react-router-dom";
import { NewsArticle } from "@/data/newsData";

interface ArticleCardProps {
  article: NewsArticle;
  variant?: "horizontal" | "vertical";
}

const ArticleCard = ({ article, variant = "vertical" }: ArticleCardProps) => {
  if (variant === "horizontal") {
    return (
      <Link to={`/article/${article.id}`} className="block">
        <article className="article-card group cursor-pointer flex gap-4 animate-fade-in">
          <div className="flex-1 space-y-2">
            <span className="category-badge text-[10px]">{article.category}</span>
            <h3 className="headline text-lg font-semibold group-hover:text-primary transition-colors leading-snug">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{article.publishedAt}</span>
            </div>
          </div>
          <div className="w-28 h-28 shrink-0 overflow-hidden rounded-sm">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} className="block">
      <article className="article-card group cursor-pointer animate-fade-in">
        <div className="overflow-hidden rounded-sm mb-3">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="category-badge text-[10px]">{article.category}</span>
        <h3 className="headline text-lg font-semibold mt-2 group-hover:text-primary transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <span className="font-medium">{article.author}</span>
          <span>•</span>
          <span>{article.publishedAt}</span>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
