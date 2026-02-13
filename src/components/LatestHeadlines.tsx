import { Link } from "react-router-dom";
import { NewsArticle } from "@/data/newsData";

interface LatestHeadlinesProps {
  articles: NewsArticle[];
}

const LatestHeadlines = ({ articles }: LatestHeadlinesProps) => {
  return (
    <aside className="animate-fade-in">
      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 pb-2 border-b-2 border-primary">
        Latest Headlines
      </h2>
      <div className="space-y-4">
        {articles.slice(0, 6).map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="block pb-4 border-b border-divider last:border-0 group"
          >
            <h3 className="sidebar-headline">
              {article.title}
            </h3>
            <span className="timestamp mt-1 block">{article.publishedAt}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default LatestHeadlines;
