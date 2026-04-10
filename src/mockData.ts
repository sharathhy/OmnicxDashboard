import { ScoreData } from "./types";
import { DEFAULT_METRICS, REGION_RETAILERS } from "./constants";

export const MOCK_SCORES: ScoreData[] = [];

const dates = ['2026-03-26', '2026-03-30', '2026-04-01', '2026-04-02'];
const regions = Object.keys(REGION_RETAILERS);

dates.forEach(date => {
  regions.forEach(region => {
    const regionRetailers = REGION_RETAILERS[region];
    DEFAULT_METRICS.forEach(metric => {
      regionRetailers.forEach(retailer => {
        MOCK_SCORES.push({
          id: `${metric.id}-${retailer.id}-${date}`,
          metricId: metric.id,
          retailerId: retailer.id,
          score: Math.floor(Math.random() * 100),
          comments: `Performance for ${metric.category} at ${retailer.name} in ${region} is ${Math.random() > 0.5 ? 'improving' : 'stable'}.`,
          date: date,
          region: region
        });
      });
    });
  });
});
