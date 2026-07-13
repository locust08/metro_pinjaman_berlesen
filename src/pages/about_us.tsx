import LegacyPage, { type LegacyPageProps } from '../lib/legacyPage';
import { loadLegacyPage } from '../lib/legacyPageData';

export function getStaticProps() {
  return { props: { ...loadLegacyPage('about_us.html'), pageId: 'about' } };
}

export default function AboutUs(props: LegacyPageProps) {
  return <LegacyPage {...props} />;
}
