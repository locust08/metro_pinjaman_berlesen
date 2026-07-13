import LegacyPage, { type LegacyPageProps } from '../lib/legacyPage';
import { loadLegacyPage } from '../lib/legacyPageData';

export function getStaticProps() {
  return { props: { ...loadLegacyPage('index.html'), pageId: 'home' } };
}

export default function Index(props: LegacyPageProps) {
  return <LegacyPage {...props} />;
}
