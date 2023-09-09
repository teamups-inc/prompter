import styles from './page.module.css'
import PromptInputAndOutputSection from '@/components/PromptInputAndOutputSection';

export default async function Home() {
  return (
    <main className={styles.main}>
      <div style={rootDivStyle}>
        <PromptInputAndOutputSection />
      </div>
    </main>
  );
}

const rootDivStyle: React.CSSProperties = {
  paddingLeft: '48px',
  paddingRight: '48px',
  width: '100%'
};