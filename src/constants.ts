import { Metric, Retailer, ScoreData } from "./types";
import walmartLogo from '/walmart.png';
import costcoLogo from '/costco.png';
import bestbuyLogo from '/bestbuy.png';
import amazonLogo from '/amazon.png';

export const DEFAULT_METRICS: Metric[] = [
  { id: '1', category: 'Top 10 Branded Search', description: 'Hero device in top 10 branded search results', criteria: 'Yes = Green', storeType: 'ONLINE' },
  { id: '2', category: 'CP+ Categorization', description: 'Category page and nav filters setup', criteria: 'Yes = Green', storeType: 'ONLINE' },
  { id: '3', category: 'Help Me Choose', description: 'HMC solution live with AI chat', criteria: 'Yes = Green', storeType: 'ONLINE' },
  { id: '4', category: 'Help Me Learn', description: 'HML chat on hero device PDPs', criteria: 'Yes = Green', storeType: 'ONLINE' },
  { id: '5', category: 'Interactive Studios', description: 'IS module on hero device PDPs', criteria: 'Yes = Green', storeType: 'ONLINE' },
  { id: '6', category: 'Hero Device Offers', description: 'Devices discoverable within 1 click', criteria: 'Yes = Green', storeType: 'ONLINE' },
  { id: '7', category: 'Panacea Score', description: 'Device PDP attachment rate', criteria: '>75% = Green', storeType: 'ONLINE' },
  { id: '8', category: 'Ratings & Reviews', description: 'Average star rating', criteria: '>4.2 = Green', storeType: 'ONLINE' },
  { id: '9', category: 'MISX Holiday Refresh', description: 'MISX installations refreshed', criteria: '>90% = Green', storeType: 'IN-STORE' },
  { id: '10', category: 'In-Store EE', description: 'Average score across key questions', criteria: '>80% = Green', storeType: 'IN-STORE' },
  { id: '11', category: 'Devices Powered On', description: 'Telemetry from MISX RACs', criteria: '>80% = Green', storeType: 'IN-STORE' },
  { id: '12', category: 'RDX Sessions', description: 'Sessions per device', criteria: '70-90 = Green', storeType: 'IN-STORE' },
  { id: '13', category: 'RDX Dwell Time', description: 'RDX average dwell time per device', criteria: '75-110 = Green', storeType: 'IN-STORE' },
];

export const REGION_RETAILERS: Record<string, Retailer[]> = {
  'North America': [
    { id: 'bestbuy-us', name: 'BEST BUY US', logoUrl: bestbuyLogo },
    { id: 'amazon-us', name: 'AMAZON US', logoUrl: amazonLogo },
    { id: 'walmart-us', name: 'WALMART US', logoUrl: walmartLogo },
    { id: 'costco-us', name: 'COSTCO US', logoUrl: costcoLogo },
    { id: 'best-buy-ca', name: 'BEST BUY CA', logoUrl: bestbuyLogo }, 
  ],
  'EMEA': [
  { id: 'bestbuy-us', name: 'BEST BUY US', logoUrl: bestbuyLogo },
    { id: 'amazon-us', name: 'AMAZON US', logoUrl: amazonLogo },
    { id: 'walmart-us', name: 'WALMART US', logoUrl: walmartLogo },
    { id: 'costco-us', name: 'COSTCO US', logoUrl: costcoLogo },
    { id: 'best-buy-ca', name: 'BEST BUY CA', logoUrl: bestbuyLogo }, 
  ],
  'Asia Pacific': [
   { id: 'bestbuy-us', name: 'BEST BUY US', logoUrl: bestbuyLogo },
    { id: 'amazon-us', name: 'AMAZON US', logoUrl: amazonLogo },
    { id: 'walmart-us', name: 'WALMART US', logoUrl: walmartLogo },
    { id: 'costco-us', name: 'COSTCO US', logoUrl: costcoLogo },
    { id: 'best-buy-ca', name: 'BEST BUY CA', logoUrl: bestbuyLogo }, 
  ]
};

export const DEFAULT_RETAILERS: Retailer[] = Object.values(REGION_RETAILERS).flat();


export const THRESHOLDS = {
  GOOD: 80,
  AVERAGE: 60,
};

export type ScoreStatus = 'good' | 'average' | 'critical';

export function getScoreStatus(score: number, criteria: string = ''): ScoreStatus {
  if (criteria === 'Yes = Green') {
    return score >= 80 ? 'good' : 'critical';
  }

  // Handle >X% or >X
  const greaterThanMatch = criteria.match(/>(\d+(\.\d+)?)/);
  if (greaterThanMatch) {
    const thresholdValue = parseFloat(greaterThanMatch[1]);
    // If it's a rating (like 4.2), convert to 0-100 scale
    const threshold = (thresholdValue <= 5 && !criteria.includes('%')) ? thresholdValue * 20 : thresholdValue;
    
    if (score > threshold) return 'good';
    if (score >= threshold - 20) return 'average';
    return 'critical';
  }

  // Handle range X-Y = Green
  const rangeMatch = criteria.match(/(\d+)-(\d+)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    if (score >= min) return 'good';
    if (score >= min - 20) return 'average';
    return 'critical';
  }

  // Fallback to defaults
  if (score >= THRESHOLDS.GOOD) return 'good';
  if (score >= THRESHOLDS.AVERAGE) return 'average';
  return 'critical';
}

export function getBubbleColor(score: number, criteria: string = '') {
  const status = getScoreStatus(score, criteria);
  switch (status) {
    case 'good': return 'bg-green-500';
    case 'average': return 'bg-yellow-500';
    case 'critical': return 'bg-red-500';
  }
}
