import { ScoreData } from "./types";
import { DEFAULT_METRICS, DEFAULT_RETAILERS } from "./constants";

export const MOCK_SCORES: ScoreData[] = [];

const dates = ['2026-03-26', '2026-03-30', '2026-04-01', '2026-04-02'];
const regions = ['North America', 'Europe', 'Asia Pacific'];

dates.forEach(date => {
  regions.forEach(region => {
    DEFAULT_METRICS.forEach(metric => {
      DEFAULT_RETAILERS.forEach(retailer => {
        MOCK_SCORES.push({
          id: Math.random().toString(36).substr(2, 9),
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
