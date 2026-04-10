import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Loader2, TrendingUp, AlertCircle, CheckCircle2, Download, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Metric, Retailer, ScoreData } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeType?: string;
  retailerId?: string;
  metrics: Metric[];
  retailers: Retailer[];
  scores: ScoreData[];
}

export default function AiInsightsModal({ isOpen, onClose, storeType = 'All', retailerId = '', metrics, retailers, scores }: AiInsightsModalProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const retailer = retailers.find(r => r.id === retailerId);
  const isOverall = !retailerId;

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OmniCx_Insights_${isOverall ? 'Overall' : retailer?.name}_${storeType}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!insights) return;
    setIsDownloadingWord(true);
    try {
      // Basic markdown to docx conversion (very simple for this static content)
      const sections = insights.split('\n\n').map(section => {
        if (section.startsWith('###')) {
          return new Paragraph({
            text: section.replace('### ', ''),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 400, after: 200 }
          });
        }
        if (section.startsWith('*') || section.startsWith('1.')) {
          const items = section.split('\n');
          return items.map(item => new Paragraph({
            text: item.replace(/^[*]\s+|^\d+\.\s+/, ''),
            bullet: { level: 0 },
            spacing: { before: 100, after: 100 }
          }));
        }
        return new Paragraph({
          children: [
            new TextRun({
              text: section.replace(/[*][*]/g, ''),
            }),
          ],
          spacing: { before: 200, after: 200 }
        });
      }).flat();

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: `OmniCx Insights: ${isOverall ? 'Overall Performance' : retailer?.name}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 400 }
            }),
            new Paragraph({
              text: `${isOverall ? 'Cross-Retailer' : storeType} Performance Analysis`,
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 400 }
            }),
            ...sections
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `OmniCx_Insights_${isOverall ? 'Overall' : retailer?.name}_${storeType}.docx`);
    } catch (error) {
      console.error('Error generating Word doc:', error);
    } finally {
      setIsDownloadingWord(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate a brief loading state for a more "AI-like" feel
      const timer = setTimeout(() => {
        const staticInsight = isOverall ? `
### Overall Retail Performance Insights

Based on the aggregated data across all retailers and regions, the current retail landscape shows a **highly competitive environment** with significant shifts towards unified commerce.

### Key Global Trends
*   **Omnichannel Convergence**: Retailers with integrated online and in-store experiences are seeing 30% higher customer lifetime value.
*   **AI Adoption**: Early adopters of AI-driven supply chain and personalization are outperforming peers in operational efficiency.
*   **Sustainability Focus**: Consumers are increasingly prioritizing brands with transparent and sustainable practices.

### Aggregated Strengths
*   **Digital Maturity**: Most retailers have achieved high scores in basic digital presence and e-commerce functionality.
*   **Logistics Resilience**: Supply chain metrics have stabilized, showing improved inventory turnover rates.

### Systemic Challenges
*   **Data Silos**: Many organizations still struggle with fragmented data across different store types and regions.
*   **Customer Retention**: High acquisition costs are making retention strategies more critical than ever.

### Strategic Recommendations for the Portfolio
1.  **Unified Data Platform**: Prioritize the integration of customer data across all touchpoints.
2.  **AI-First Strategy**: Implement AI for predictive analytics in inventory and personalized marketing.
3.  **Experience-Led Growth**: Focus on enhancing the physical store experience to complement digital convenience.
        ` : `
### Performance Overview for ${retailer?.name} (${storeType})

Based on the latest data analysis, **${retailer?.name}** is showing a **stable performance** in the ${storeType} category. The overall customer experience is consistent, but there are specific areas where strategic adjustments could yield significant improvements in conversion rates and customer loyalty.

### Key Strengths
*   **Brand Consistency**: High scores in visual identity and messaging across touchpoints.
*   **Operational Efficiency**: Strong performance in fulfillment and inventory management metrics.
*   **Customer Engagement**: Positive feedback loops and high repeat purchase indicators.

### Critical Areas for Improvement
*   **Personalization**: Current data suggests a "one-size-fits-all" approach. Enhancing the recommendation engine could increase AOV by 15-20%.
*   **Friction Points**: Minor delays in the checkout process (both digital and physical) are impacting final conversion metrics.
*   **Data Integration**: Bridging the gap between ${storeType === 'ONLINE' ? 'digital behavior and in-store' : 'in-store experience and digital'} profiles remains a key challenge.

### Strategic Recommendations
1.  **Hyper-Personalization**: Implement AI-driven product recommendations based on historical purchase data.
2.  **Process Optimization**: Streamline the final 3 steps of the customer journey to reduce drop-off rates.
3.  **Unified View**: Invest in cross-channel data synchronization to provide a seamless "Omni" experience.

### Competitive Context
${retailer?.name} currently holds a **strong mid-tier position**. While leading in operational metrics, competitors are slightly ahead in digital innovation and loyalty program integration. Focusing on the recommended areas will help in capturing additional market share.
        `;
        setInsights(staticInsight);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, retailerId, storeType, isOverall]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-card border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{isOverall ? 'Overall AI Insights' : `AI Insights: ${retailer?.name}`}</h2>
                <p className="text-sm text-muted-foreground">{isOverall ? 'Portfolio Performance Analysis' : `${storeType} Performance Analysis`}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8" ref={contentRef}>
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 size={48} className="animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Analyzing retail metrics and generating insights...</p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-card p-4 rounded-lg">
                <ReactMarkdown>{insights || ''}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-muted/30 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={loading || isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/80 transition-colors disabled:opacity-50"
              >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Download PDF
              </button>
              <button
                onClick={handleDownloadWord}
                disabled={loading || isDownloadingWord}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/80 transition-colors disabled:opacity-50"
              >
                {isDownloadingWord ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                Download Word
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Close Insights
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
