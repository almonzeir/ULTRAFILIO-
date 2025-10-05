'use client';

import * as React from 'react';
import GeneratedModernTemplate from '@/templates/GeneratedModernTemplate';
import type { PortfolioData } from '@/templates/types';

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = React.useState<PortfolioData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedData = localStorage.getItem('portfolioData');
      if (storedData) {
        setPortfolioData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to parse portfolio data from localStorage', error);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a nice skeleton loader
  }

  if (!portfolioData) {
    return <div>Portfolio data not found. Please create your portfolio first.</div>;
  }

  return <GeneratedModernTemplate data={portfolioData} />;
}