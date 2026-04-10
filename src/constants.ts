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

export const DEFAULT_RETAILERS: Retailer[] = [
  { id: 'bestbuy-us', name: 'BEST BUY US', logoUrl: bestbuyLogo },
  { id: 'bestbuy-ca', name: 'BEST BUY CA', logoUrl: bestbuyLogo },
  { id: 'amazon-us', name: 'AMAZON US', logoUrl: amazonLogo },
  { id: 'walmart-us', name: 'WALMART US', logoUrl: walmartLogo },
  { id: 'costco-us', name: 'COSTCO US', logoUrl: costcoLogo },
];

export const THRESHOLDS = {
  GOOD: 80,
  AVERAGE: 60,
};

export function getBubbleColor(score: number) {
  if (score >= THRESHOLDS.GOOD) return 'bg-green-500';
  if (score >= THRESHOLDS.AVERAGE) return 'bg-yellow-500';
  return 'bg-red-500';
}
