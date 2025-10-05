
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Assuming you have a db export from your firebase setup
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import type { PortfolioData } from '@/templates/types';

export default function PortfolioPage() {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = React.useState<PortfolioData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!portfolioId) return;

    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, 'portfolios', portfolioId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPortfolioData(docSnap.data() as PortfolioData);
        } else {
          setError('No such portfolio!');
        }
      } catch (e) {
        console.error('Error fetching portfolio data:', e);
        setError('Failed to load portfolio data.');
      }
      setLoading(false);
    };

    fetchPortfolioData();
  }, [portfolioId]);

  if (loading) {
    return <div>Loading...</div>; // Or a nice skeleton loader
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!portfolioData) {
    return <div>Portfolio not found.</div>;
  }

  return <GeneratedModernTemplate data={portfolioData} />;
}
