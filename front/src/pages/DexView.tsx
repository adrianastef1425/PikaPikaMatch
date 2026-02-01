import { motion } from 'framer-motion';
import { useStats } from '../hooks';
import { StatsCard } from '../components/features/StatsCard';
import { RecentlyEvaluatedList } from '../components/features/RecentlyEvaluatedList';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
import { MainLayout } from '../components/layout';

export function DexView() {
  const { stats, isLoading, error, refetch } = useStats();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <LoadingSpinner message="Loading statistics..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
          <ErrorMessage 
            message={error}
            onRetry={refetch}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div 
        className="pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
            Dex
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Community statistics and your recent votes
          </p>
        </div>

        {/* Scrollable content */}
        <div className="px-4 md:px-6 py-6">
          {/* Layout: Main content on left, Recently Evaluated on right for large screens */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content - Community sections */}
            <div className="flex-1 space-y-8">
              {/* Community Favorites Section */}
              <section aria-labelledby="favorites-heading">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-pastel-green text-xl md:text-2xl" aria-hidden="true">
                    favorite
                  </span>
                  <h3 id="favorites-heading" className="font-display font-bold text-lg md:text-xl text-gray-900 dark:text-white">
                    Community Favorites
                  </h3>
                </div>

                {stats.favorites.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No favorites yet. Start voting to see results!</p>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide" role="list" aria-label="Community favorite characters">
                    {stats.favorites.map(({ character, stats: charStats }) => (
                      <div key={character.id} role="listitem">
                        <StatsCard
                          character={character}
                          stats={charStats}
                          variant="favorite"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Most Controversial Section */}
              <section aria-labelledby="controversial-heading">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-pastel-red text-xl md:text-2xl" aria-hidden="true">
                    close
                  </span>
                  <h3 id="controversial-heading" className="font-display font-bold text-lg md:text-xl text-gray-900 dark:text-white">
                    Most Controversial
                  </h3>
                </div>

                {stats.controversial.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No controversial characters yet. Start voting to see results!</p>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide" role="list" aria-label="Most controversial characters">
                    {stats.controversial.map(({ character, stats: charStats }) => (
                      <div key={character.id} role="listitem">
                        <StatsCard
                          character={character}
                          stats={charStats}
                          variant="controversial"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Recently Evaluated Section - Sidebar on large screens */}
            <aside className="lg:w-80 xl:w-96 flex-shrink-0" aria-labelledby="recent-heading">
              <div className="lg:sticky lg:top-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl" aria-hidden="true">
                    history
                  </span>
                  <h3 id="recent-heading" className="font-display font-bold text-lg md:text-xl text-gray-900 dark:text-white">
                    Recently Evaluated
                  </h3>
                </div>

                <RecentlyEvaluatedList characters={stats.recentlyEvaluated} />
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
