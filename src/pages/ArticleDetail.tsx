import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";

const ArticleDetail = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">Article not found.</p>
            <Button asChild variant="outline"><Link to="/learn">Back to Learn</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <article className="container py-6 md:py-10 max-w-3xl space-y-6">
        <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Learn
        </Link>

        <div className="space-y-3">
          <Badge>{article.category}</Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
          </div>
        </div>

        <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>

        <div className="prose prose-sm md:prose-base max-w-none space-y-4">
          <p className="text-base md:text-lg text-muted-foreground italic">{article.excerpt}</p>
          {article.content.map((p, i) => (
            <p key={i} className="text-sm md:text-base leading-relaxed">{p}</p>
          ))}
        </div>

        {related.length > 0 && (
          <section className="border-t pt-6 space-y-3">
            <h2 className="font-bold">More in {article.category}</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link key={r.id} to={`/learn/${r.slug}`} className="group block rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default ArticleDetail;
