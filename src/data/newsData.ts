export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  isFeatured?: boolean;
  readTime: number;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Major Climate Summit Reaches Historic Agreement on Carbon Emissions",
    excerpt: "World leaders convene in Geneva to finalize landmark deal that commits nations to 50% emission reductions by 2035, marking a pivotal moment in global climate action.",
    content: `In what environmental advocates are calling a watershed moment for climate policy, representatives from 195 countries have agreed to the most ambitious carbon reduction targets in history.

The Geneva Climate Accord, signed early Tuesday morning after marathon negotiations, commits signatory nations to reducing carbon emissions by 50% from 2020 levels by 2035. The agreement also establishes a $100 billion annual fund to help developing nations transition to renewable energy.

"This is the moment future generations will look back on as the turning point," said UN Secretary-General Maria Santos. "We have finally matched our actions to the urgency of the crisis."

Key provisions of the accord include:
- Mandatory phase-out of coal-fired power plants by 2030
- Carbon pricing mechanisms in all major economies
- Protected status for remaining rainforests
- Binding review mechanisms every five years

Industry groups have expressed mixed reactions, with renewable energy sectors welcoming the news while traditional energy companies warn of potential job losses.`,
    category: "Environment",
    author: "Sarah Mitchell",
    publishedAt: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&auto=format",
    isFeatured: true,
    readTime: 5
  },
  {
    id: "2",
    title: "Tech Giants Face New Antitrust Regulations in Landmark Legislation",
    excerpt: "Congress passes sweeping reform package aimed at curbing market dominance of major technology companies.",
    content: `Lawmakers have passed comprehensive antitrust legislation that could fundamentally reshape the technology industry. The Digital Markets Competition Act targets companies with market capitalizations exceeding $500 billion, imposing new restrictions on acquisitions and self-preferencing practices.

The bill, which passed with bipartisan support, requires tech platforms to allow third-party app stores, prohibits platforms from favoring their own products in search results, and mandates data portability for users.`,
    category: "Technology",
    author: "Michael Chen",
    publishedAt: "4 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format",
    readTime: 4
  },
  {
    id: "3",
    title: "Federal Reserve Signals Rate Cuts Amid Cooling Inflation",
    excerpt: "Central bank officials indicate potential policy shift as economic indicators show inflation returning to target levels.",
    content: `The Federal Reserve has signaled a significant shift in monetary policy, with Chair Jerome Williams suggesting that interest rate cuts could begin as early as the next quarter.

Speaking at the Economic Policy Symposium, Williams noted that inflation has cooled considerably, with the latest Consumer Price Index showing a 2.1% annual increase—the lowest in three years.

Market reaction was immediate, with stocks rallying and bond yields falling on the news.`,
    category: "Business",
    author: "Jennifer Walsh",
    publishedAt: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format",
    readTime: 3
  },
  {
    id: "4",
    title: "Breakthrough in Alzheimer's Research Offers New Hope for Treatment",
    excerpt: "Scientists identify novel protein pathway that could lead to disease-modifying therapies within the decade.",
    content: `Researchers at the National Institutes of Health have announced a major breakthrough in understanding Alzheimer's disease, identifying a previously unknown protein interaction that appears central to the disease's progression.

The discovery, published in the journal Nature Medicine, reveals that a protein called TREM3 plays a crucial role in the brain's inflammatory response to amyloid plaques.`,
    category: "Health",
    author: "Dr. Robert Kim",
    publishedAt: "6 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format",
    readTime: 6
  },
  {
    id: "5",
    title: "City Council Approves $2 Billion Infrastructure Renewal Plan",
    excerpt: "Historic investment package targets aging bridges, public transit expansion, and smart city technology upgrades.",
    content: `In a unanimous vote, the City Council has approved an ambitious $2 billion infrastructure package that will transform urban transportation and modernize aging public works.

The plan includes the renovation of 47 bridges rated as "structurally deficient," extension of the metro system by 15 miles, and installation of smart traffic management systems across all major corridors.

Mayor Patricia Rodriguez called it "the most significant investment in our city's infrastructure in half a century."`,
    category: "Local",
    author: "David Martinez",
    publishedAt: "7 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format",
    readTime: 4
  },
  {
    id: "6",
    title: "National Team Advances to World Cup Semifinals in Stunning Upset",
    excerpt: "Underdog squad defeats defending champions 2-1 in dramatic penalty shootout after regulation ends in deadlock.",
    content: `In one of the most thrilling matches in World Cup history, the national team has advanced to the semifinals after defeating the defending champions in a dramatic penalty shootout.

Striker Marcus Johnson converted the decisive penalty after goalkeeper Elena Torres made two crucial saves. The team now faces Brazil in what promises to be an epic semifinal clash.`,
    category: "Sports",
    author: "Chris Thompson",
    publishedAt: "8 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format",
    readTime: 3
  },
  {
    id: "7",
    title: "Acclaimed Director's New Film Receives Standing Ovation at Festival",
    excerpt: "Critics hail psychological thriller as 'masterpiece of modern cinema' following world premiere at Cannes.",
    content: `Award-winning director Sofia Reyes received a 12-minute standing ovation at the Cannes Film Festival following the premiere of her highly anticipated psychological thriller, "The Echo Chamber."

The film, starring Oscar winner Michael Okonkwo, explores themes of digital identity and parasocial relationships in the age of social media.`,
    category: "Entertainment",
    author: "Amanda Foster",
    publishedAt: "10 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format",
    readTime: 4
  },
  {
    id: "8",
    title: "SpaceX Successfully Lands First Private Mission on Mars Surface",
    excerpt: "Historic landing marks new era of commercial space exploration as Starship delivers science payload to Red Planet.",
    content: `SpaceX has achieved a historic milestone with the successful landing of its Starship vehicle on the Martian surface, delivering a payload of scientific instruments for the first privately-funded Mars mission.

The landing, which occurred at 3:47 AM EST, was confirmed after a tense 7-minute descent through the Martian atmosphere. CEO Elon Musk called it "a giant leap for commercial space exploration."`,
    category: "Science",
    author: "Dr. Neil Patterson",
    publishedAt: "12 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format",
    readTime: 5
  },
  {
    id: "9",
    title: "Housing Market Shows Signs of Stabilization After Year of Volatility",
    excerpt: "New data indicates home prices leveling off as inventory increases and mortgage rates moderate.",
    content: `The housing market is showing signs of stabilization after a tumultuous year marked by rapid price swings and inventory shortages. New data from the National Association of Realtors shows home prices remaining flat for the third consecutive month.

Analysts attribute the shift to increased housing inventory, now up 18% year-over-year, and moderating mortgage rates that have dipped below 6% for the first time since 2022.`,
    category: "Business",
    author: "Katherine Brooks",
    publishedAt: "14 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format",
    readTime: 4
  },
  {
    id: "10",
    title: "Education Department Announces Major Student Loan Forgiveness Program",
    excerpt: "New initiative targets borrowers in public service roles, potentially benefiting 2 million Americans.",
    content: `The Department of Education has unveiled a significant expansion of student loan forgiveness programs, with a focus on borrowers working in public service sectors including education, healthcare, and government.

Under the new guidelines, qualifying borrowers who have made consistent payments for 10 years will be eligible for complete loan forgiveness. The program is expected to provide relief to approximately 2 million Americans.`,
    category: "Politics",
    author: "James Wilson",
    publishedAt: "16 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format",
    readTime: 5
  }
];

export const trendingTopics = [
  "Climate Summit Geneva",
  "Tech Antitrust Bill",
  "Federal Reserve Rates",
  "World Cup Semifinals",
  "Mars Landing SpaceX"
];

export const categories = [
  "All",
  "Politics",
  "Business",
  "Technology",
  "Science",
  "Health",
  "Sports",
  "Entertainment",
  "Local",
  "Environment"
];
