import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { articles, articleCategories } from "@/data/articles";

const Learn = () => {
  const [category, setCategory] = useState<(typeof articleCategories)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const inCat = category === "All" || a.category === category;
      const q = query.toLowerCase();
      const inQuery = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [category, query]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="border-b bg-secondary/40">
        <div className="container py-8 md:py-12 space-y-4">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="secondary">Learn</Badge>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Smarter car decisions, one guide at a time
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Buying guides, maintenance how-tos, and honest reviews from our team of mechanics and reviewers.
            </p>
          </div>
          <Input
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="flex gap-2 flex-wrap">
            {articleCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  category === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12 space-y-8">
        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">No articles match your search.</p>
        )}

        {featured && (
          <Link
            to={`/learn/${featured.slug}`}
            className="group block rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto overflow-hidden bg-muted">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 md:p-8 flex flex-col justify-center space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge>{featured.category}</Badge>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-muted-foreground">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((a) => (
              <Link
                key={a.id}
                to={`/learn/${a.slug}`}
                className="group block rounded-lg overflow-hidden border bg-card hover:shadow-md transition-shadow"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">{a.category}</Badge>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.readTime}</span>
                  </div>
                  <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
