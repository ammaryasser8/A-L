import hotels from '../data/hotels.json';
import homeConfig from '../data/home-config.json';
import products from '../data/products.json';

import HeroSplit from '../components/home/HeroSplit';
import CategoryGrid from '../components/home/CategoryGrid';
import TestimonialGrid from '../components/home/TestimonialGrid';

export default function HomePage() {
  return (
    <>
      <HeroSplit homeConfig={homeConfig} hotels={hotels} />
      <CategoryGrid categories={homeConfig.homepage.sharedCategories} />
      <TestimonialGrid products={products} hotels={hotels} />
      {/* TODO: <SiteFooter /> — هتضاف هنا لما فرع feature/shared-footer يتدمج في main */}
    </>
  );
}
