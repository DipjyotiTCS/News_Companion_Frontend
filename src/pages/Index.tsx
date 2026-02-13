import { useState, useMemo } from "react";
import Header from "@/components/Header";
import TrendingBar from "@/components/TrendingBar";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import LatestHeadlines from "@/components/LatestHeadlines";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import { newsArticles } from "@/data/newsData";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    let articles = [...newsArticles];

    // Filter by category
    if (selectedCategory !== "All") {
      articles = articles.filter(
        (article) => article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
      );
    }

    return articles;
  }, [selectedCategory, searchQuery]);

  const featuredArticle = filteredArticles.find((a) => a.isFeatured) || filteredArticles[0];
  const otherArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);
  const gridArticles = otherArticles.slice(0, 4);
  const moreArticles = otherArticles.slice(4);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory("All");
  };

  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic);
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
      />
      <TrendingBar onTopicClick={handleTopicClick} />

      <main className="container mx-auto px-4 py-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-serif font-bold mb-2">No articles found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            <section className="mb-10 pb-10 border-b border-divider">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {featuredArticle && (
                    <FeaturedArticle article={featuredArticle} />
                  )}
                </div>
                <div className="lg:border-l lg:border-divider lg:pl-8">
                  <LatestHeadlines articles={newsArticles} />
                </div>
              </div>
            </section>

            {/* Article Grid */}
            {gridArticles.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-6 pb-2 border-b-2 border-primary inline-block">
                  More Stories
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gridArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* More Articles - Horizontal */}
            {moreArticles.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-6 pb-2 border-b-2 border-primary inline-block">
                  Also In The News
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {moreArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="horizontal"
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Chatbot for global search */}
      <Chatbot initialArticle={null} onClearArticle={() => {}} />
    </div>
  );
};

export default Index;
