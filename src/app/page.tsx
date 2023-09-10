import PromptsPage from '@/components/PromptsPage';
import styles from './page.module.css'

export default async function Home() {
  return (
    <main className={styles.main}>
      <div style={rootDivStyle}>
        <PromptsPage />
      </div>
    </main>
  );
}

const rootDivStyle: React.CSSProperties = {
  paddingLeft: '48px',
  paddingRight: '48px',
  width: '100%'
};