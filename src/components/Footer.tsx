import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    news: ["Politics", "Business", "Technology", "Science", "Health"],
    opinion: ["Editorials", "Letters", "Op-Ed", "Columnists"],
    lifestyle: ["Entertainment", "Sports", "Travel", "Food", "Arts"],
    about: ["About Us", "Contact", "Careers", "Advertise", "Privacy Policy"],
  };

  return (
    <footer className="bg-trending-bg text-trending-fg mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h2 className="font-serif text-2xl font-bold mb-4">The Daily Chronicle</h2>
            <p className="text-sm text-trending-fg/70 mb-4">
              Delivering trusted journalism since 1892. Your source for news that matters.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">News</h3>
            <ul className="space-y-2">
              {footerLinks.news.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-trending-fg/70 hover:text-trending-fg transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Opinion</h3>
            <ul className="space-y-2">
              {footerLinks.opinion.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-trending-fg/70 hover:text-trending-fg transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Lifestyle</h3>
            <ul className="space-y-2">
              {footerLinks.lifestyle.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-trending-fg/70 hover:text-trending-fg transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-trending-fg/70 hover:text-trending-fg transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="max-w-xl">
            <h3 className="font-semibold mb-2">Subscribe to our newsletter</h3>
            <p className="text-sm text-trending-fg/70 mb-4">
              Get the day's top stories delivered to your inbox every morning.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-trending-fg/50">
          <p>© {new Date().getFullYear()} The Daily Chronicle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
