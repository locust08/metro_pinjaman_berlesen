import LegacyPage, { type LegacyPageProps } from '../lib/legacyPage';
import { loadLegacyPage } from '../lib/legacyPageData';

export function getStaticProps() {
  return { props: loadLegacyPage('how_to_apply.html') };
}

export default function HowToApply(props: LegacyPageProps) {
  return <LegacyPage {...props} />;
}
