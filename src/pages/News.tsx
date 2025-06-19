import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { useEffect, useState } from "react";
import { TablesInsert } from "../integrations/supabase/types";

const News = () => {
  const [news, setNews] = useState<TablesInsert<"news_items">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  });

  async function fetchNews() {
    const { data, error } = await supabase.from("news_items").select("*");

    if (error) {
      console.error("Error fetching news:", error);
    }
    setNews(data);
    setIsLoading(false);
  }
  const NewsSkeleton = () => (
    <article className="scout-card overflow-hidden animate-pulse">
      <div className="md:flex">
        <div className="md:w-1/3 bg-gray-300 h-48 md:h-full" />
        <div className="md:w-2/3 p-6 space-y-4">
          <div className="h-4 w-1/3 bg-gray-300 rounded" />
          <div className="h-6 w-2/3 bg-gray-400 rounded" />
          <div className="h-4 w-full bg-gray-300 rounded" />
          <div className="h-4 w-5/6 bg-gray-300 rounded" />
          <div className="h-4 w-2/3 bg-gray-300 rounded" />
        </div>
      </div>
    </article>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-scout-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">أخبار السرية</h1>
          <p className="text-xl">تابع آخر أخبار وفعاليات سرية كابول الكشفية</p>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {isLoading
              ? Array.from({ length: 1 }).map((_, i) => (
                  <NewsSkeleton key={i} />
                ))
              : news
                  .filter((article) => article.isPublished)
                  .map((article) => (
                    <article
                      key={article.id}
                      className="scout-card overflow-hidden"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar size={16} className="ml-1" />
                            {article.publishDate.split("T")[0]}
                          </div>
                          <h2 className="text-2xl font-bold text-scout-green mb-3">
                            {article.title}
                          </h2>
                          <p className="text-gray-600 mb-4 text-lg">
                            {article.summary}
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            {article.content}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
