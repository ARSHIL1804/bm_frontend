import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '@/components/sidebar';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';

interface Article {
  image: string;
  title: string;
  summary: string;
  url: string;
}

export default function ChessNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://api2.bmsamay.com/latest_articles');
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();

    // Check for token in URL or localStorage
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token') || localStorage.getItem('token');
    setShowSidebar(!!token);
  }, [location.search]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col relative h-full min-h-full overflow-y-hidden ${!showSidebar ? 'w-full' : ''}`}>

        <div className='contain-paint h-full w-full absolute'>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 z-0">
            <div className="absolute inset-0 opacity-10 bg-[url('/chess-pattern.svg')] bg-repeat"></div>
          </div>

          {/* Enhanced depth elements */}
          <div className="absolute top-20 -left-20 w-96 h-96 bg-neon-green opacity-10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500 opacity-10 rounded-full filter blur-3xl"></div>
        </div>

        <Header headerTitle='Chess News' showChessbase={true}/>

        <main className="flex-1 p-6 md:p-10 z-10 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-neon-green"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-black/60 backdrop-filter backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-neon-green/30 transition-all duration-300 flex flex-col border border-neon-green/20"
                >
                  <div className="relative h-64">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24"></div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-neon-green hover:text-white transition-colors duration-300 line-clamp-3">{article.title}</h2>
                      <p className="text-gray-300 mb-6 text-base line-clamp-4">{article.summary}</p>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-neon-green text-black px-4 py-2 rounded-full hover:bg-white transition-colors duration-300 text-base font-medium w-full"
                    >
                      Read Full Article <FaExternalLinkAlt className="ml-2" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}