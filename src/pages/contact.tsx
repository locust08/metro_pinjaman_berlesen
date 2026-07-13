import LegacyPage, { type LegacyPageProps } from '../lib/legacyPage';
import { loadLegacyPage } from '../lib/legacyPageData';

export function getStaticProps() {
  return { props: { ...loadLegacyPage('contact.html'), pageId: 'contact' } };
}

export default function Contact(props: LegacyPageProps) {
  return <LegacyPage {...props} />;
}
