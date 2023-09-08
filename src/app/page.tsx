import mongoClientPromise from '@/services/mongodb';
import styles from './page.module.css'

export default async function Home() {
  await mongoClientPromise;
  console.log('Successfully connected to MongoDB');
  
  return (
    <main className={styles.main}>
      <div>
        Hello. Your tiny NextJS app is up and running :)
      </div>
    </main>
  );
}
