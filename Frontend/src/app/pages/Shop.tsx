import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { categories, seasons, Plant } from '../data/plants';
import { PlantCard } from '../components/PlantCard';
import { getProducts } from '../api/products';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name';

export function Shop() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All Seasons');
  const [selectedCareLevel, setSelectedCareLevel] = useState('All');
  const [priceMax, setPriceMax] = useState(3000);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setPlants)
      .catch(() => setError('Could not load plants from the server.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result: Plant[] = [...plants];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.scientificName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedSeason !== 'All Seasons') {
      result = result.filter(p => p.season.includes(selectedSeason));
    }

    if (selectedCareLevel !== 'All') {
      result = result.filter(p => p.careLevel === selectedCareLevel.toLowerCase());
    }

    result = result.filter(p => p.price <= priceMax);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'featured': result.sort((a, b) => (b.aiRecommended ? 1 : 0) - (a.aiRecommended ? 1 : 0)); break;
    }

    return result;
  }, [plants, search, selectedCategory, selectedSeason, selectedCareLevel, priceMax, sortBy]);

  const activeFilters = [
    selectedCategory !== 'All' && selectedCategory,
    selectedSeason !== 'All Seasons' && selectedSeason,
    selectedCareLevel !== 'All' && selectedCareLevel,
    priceMax < 3000 && `Under ₹${priceMax}`,
  ].filter(Boolean) as string[];

  function clearFilter(filter: string) {
    if (filter === selectedCategory) setSelectedCategory('All');
    if (filter === selectedSeason) setSelectedSeason('All Seasons');
    if (filter === selectedCareLevel) setSelectedCareLevel('All');
    if (filter.startsWith('Under')) setPriceMax(3000);
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="py-14 px-6 text-center" style={{ background: 'linear-gradient(to bottom, #0A1A0E, #1A4731)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '48px', color: 'white' }}>Our Plant Shop</h1>
          <p className="mt-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
            {plants.length} curated plants for every space and lifestyle in India
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted-foreground)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search plants by name, type..."
              className="w-full pl-11 pr-4 py-3 rounded-xl outline-none"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl transition-colors"
            style={{ background: showFilters ? '#1A4731' : 'var(--color-card)', color: showFilters ? 'white' : 'var(--color-foreground)', border: '1px solid var(--color-border)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
          >
            <SlidersHorizontal size={16} />
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="pl-4 pr-8 py-3 rounded-xl outline-none appearance-none"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', minWidth: '160px' }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A-Z</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-muted-foreground)' }} />
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 rounded-2xl grid sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                {/* Category */}
                <div>
                  <p className="mb-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="px-3 py-1.5 rounded-full capitalize transition-all"
                        style={{
                          background: selectedCategory === cat ? '#1A4731' : 'var(--color-secondary)',
                          color: selectedCategory === cat ? 'white' : 'var(--color-foreground)',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500,
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Season */}
                <div>
                  <p className="mb-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Season</p>
                  <div className="flex flex-wrap gap-2">
                    {seasons.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSeason(s)}
                        className="px-3 py-1.5 rounded-full transition-all"
                        style={{
                          background: selectedSeason === s ? '#1A4731' : 'var(--color-secondary)',
                          color: selectedSeason === s ? 'white' : 'var(--color-foreground)',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Care Level */}
                <div>
                  <p className="mb-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Care Level</p>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Easy', 'Moderate', 'Expert'].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedCareLevel(lvl)}
                        className="px-3 py-1.5 rounded-full transition-all"
                        style={{
                          background: selectedCareLevel === lvl ? '#1A4731' : 'var(--color-secondary)',
                          color: selectedCareLevel === lvl ? 'white' : 'var(--color-foreground)',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500,
                        }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="mb-3" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Max Price: ₹{priceMax}</p>
                  <input
                    type="range"
                    min={100}
                    max={3000}
                    step={100}
                    value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full accent-green-700"
                  />
                  <div className="flex justify-between mt-1">
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'var(--color-muted-foreground)' }}>₹100</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'var(--color-muted-foreground)' }}>₹3,000</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(f => (
              <button
                key={f}
                onClick={() => clearFilter(f)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(30,86,49,0.1)', color: '#1A4731', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500 }}
              >
                {f} <X size={12} />
              </button>
            ))}
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedSeason('All Seasons'); setSelectedCareLevel('All'); setPriceMax(3000); }}
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-muted-foreground)' }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="mb-6" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-muted-foreground)' }}>
          {loading ? 'Loading plants...' : `${filtered.length} plant${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Grid */}
        {error ? (
          <div className="text-center py-24">
            <p className="mt-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: 'var(--color-foreground)' }}>{error}</p>
          </div>
        ) : loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-2xl" style={{ height: '360px', background: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ fontSize: '48px' }}>🪴</p>
            <p className="mt-4" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: 'var(--color-foreground)' }}>No plants found</p>
            <p className="mt-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map(plant => (
                <motion.div
                  key={plant.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <PlantCard plant={plant} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
