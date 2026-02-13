import { Link } from "react-router-dom";
import { NewsArticle } from "@/data/newsData";

interface FeaturedArticleProps {
  article: NewsArticle;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  return (
    <Link to={`/article/${article.id}`} className="block">
      <article className="group cursor-pointer animate-fade-in">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <span className="category-badge">{article.category}</span>
            <h2 className="headline text-2xl sm:text-3xl md:text-4xl font-bold group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            <p className="subheadline text-base sm:text-lg leading-relaxed">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">{article.author}</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-sm">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedArticle;
