import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchIndex } from '../utils/searchIndex';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './SearchPage.module.css';

const DISCOVERY_CATEGORIES = ['Rooms', 'Suites', 'Restaurants', 'Spa & Wellness', 'Beach & Leisure', 'Events & Meetings'];
const FEATURED_CATEGORIES = ['Rooms', 'Suites', 'Spa & Wellness'];

export default function SearchPage() {
  useDocumentTitle('Search');
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const results = searchIndex(query, 40);
  const hasQuery = Boolean(query.trim());
  const featured = FEATURED_CATEGORIES.map((category) => products.find((product) => product.category === category)).filter(Boolean);

  function setSearch(value) {
    setQuery(value);
    setParams(value ? { q: value } : {}, { replace: true });
  }

  function handleChange(event) {
    setSearch(event.target.value);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Search AL Hospitality Group</p>
        <input
          autoFocus
          className={styles.input}
          type="search"
          placeholder="Rooms, dining, spa, a destination…"
          value={query}
          onChange={handleChange}
        />

        {hasQuery && (
          <p className={styles.count}>{results.length} result{results.length === 1 ? '' : 's'}</p>
        )}

        {hasQuery ? (
          <>
            <div className={styles.results}>
              {results.map((result) => (
                <Link key={result.id} to={result.path} className={styles.result}>
                  <span className={styles.kind}>{result.kind}</span>
                  <span className={styles.title}>{result.title}</span>
                  {result.subtitle && <span className={styles.subtitle}>{result.subtitle}</span>}
                </Link>
              ))}
            </div>
            {results.length === 0 && (
              <section className={styles.empty} aria-live="polite">
                <p className={styles.eyebrow}>Nothing matched</p>
                <h2>Try a different way in.</h2>
                <p>Search a destination, a room, or one of the collections below.</p>
                <div className={styles.categoryList}>
                  {DISCOVERY_CATEGORIES.slice(0, 4).map((category) => <button type="button" key={category} onClick={() => setSearch(category)}>{category}</button>)}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className={styles.discovery} aria-labelledby="search-discovery-title">
            <div className={styles.discoveryHead}>
              <div><p className={styles.eyebrow}>Begin with a feeling</p><h2 id="search-discovery-title">Discover the collection.</h2></div>
              <p>Browse verified stays and experiences already available across the two AL destinations.</p>
            </div>
            <div className={styles.categoryList} aria-label="Search by category">
              {DISCOVERY_CATEGORIES.map((category) => <button type="button" key={category} onClick={() => setSearch(category)}>{category}</button>)}
            </div>
            <div className={styles.featureGrid}>
              {featured.map((product) => {
                const hotel = hotels.find((item) => item.id === product.hotelId);
                return <Link className={styles.feature} to={`/hotels/${hotel?.slug}/product/${product.slug}`} key={product.id}>
                  <img src={`/${product.images[0]}`} alt="" loading="lazy" />
                  <div><span>{product.category} · {hotel?.shortName}</span><strong>{product.title}</strong><em>Explore ↗</em></div>
                </Link>;
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
