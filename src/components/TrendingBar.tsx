import { TrendingUp } from "lucide-react";
import { trendingTopics } from "@/data/newsData";

interface TrendingBarProps {
  onTopicClick: (topic: string) => void;
}

const TrendingBar = ({ onTopicClick }: TrendingBarProps) => {
  return (
    <div className="trending-bar">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 text-sm font-semibold shrink-0">
            <TrendingUp className="w-4 h-4" />
            <span>TRENDING:</span>
          </div>
          <div className="flex items-center gap-4">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => onTopicClick(topic)}
                className="text-sm text-trending-fg/80 hover:text-trending-fg transition-colors whitespace-nowrap"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingBar;
