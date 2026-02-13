import { Menu, Search, Cloud, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { categories } from "@/data/newsData";

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  onSearch: (query: string) => void;
}

const Header = ({ onCategoryChange, selectedCategory, onSearch }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSearch(false);
  };

  return (
    <header className="border-b border-divider bg-background sticky top-0 z-40">
      {/* Top bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 border-b border-divider">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 text-sm">
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Sections</span>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Cloud className="w-4 h-4" />
              <span>72°F</span>
            </div>
          </div>
          
          <div className="text-xs sm:text-sm text-muted-foreground">
            {currentDate}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)}>
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Subscribe
            </Button>
            <Button variant="default" size="sm">
              Log in
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <form onSubmit={handleSearchSubmit} className="py-3 animate-fade-in">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <Button type="submit">Search</Button>
            </div>
          </form>
        )}

        {/* Masthead */}
        <div className="py-4 text-center">
          <h1 className="masthead-title text-3xl sm:text-4xl md:text-5xl">
            The Daily Chronicle
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your trusted source for news that matters
          </p>
        </div>

        {/* Navigation */}
        <nav className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-center gap-1 sm:gap-2 py-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap
                  ${selectedCategory === category 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-foreground/70 hover:text-foreground"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
