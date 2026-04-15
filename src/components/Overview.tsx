import React, { useState } from 'react';
import { Metric, Retailer, ScoreData } from '../types';
import { getBubbleColor } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Sparkles, X, Save, MessageSquare, Edit3 } from 'lucide-react';
import { cn } from '../lib/utils';
import bestbuylogo from '/bestbuy.png';
import amazonlogo from '/amazon.png';
import walmartlogo from '/walmart.png';
import costcologo from '/costco.png';

interface OverviewProps {
  metrics: Metric[];
  retailers: Retailer[];
  scores: ScoreData[];
  selectedRetailer: string;
  selectedStoreType: string;
  onOpenAiInsights: (storeType: string, retailerId: string) => void;
  onOpenOverallAiInsights: () => void;
  onUpdateScore?: (score: ScoreData) => void;
  onUpdateMetric?: (metric: Metric) => void;
  isEditable?: boolean;
}

export default function Overview({ 
  metrics, 
  retailers, 
  scores, 
  selectedRetailer, 
  selectedStoreType, 
  onOpenAiInsights,
  onOpenOverallAiInsights,
  onUpdateScore,
  onUpdateMetric,
  isEditable = false
}: OverviewProps) {
  const [editingScore, setEditingScore] = useState<{ score: ScoreData; metric: Metric } | null>(null);

  const filteredRetailers = selectedRetailer === 'All Retailers' ? retailers : retailers.filter(r => r.name === selectedRetailer);
  const filteredMetrics = selectedStoreType === 'All' ? metrics : metrics.filter(m => m.storeType === selectedStoreType);

  const onlineMetrics = filteredMetrics.filter(m => m.storeType === 'ONLINE');
  const inStoreMetrics = filteredMetrics.filter(m => m.storeType === 'IN-STORE');

  const handleScoreClick = (score: ScoreData, metric: Metric) => {
    setEditingScore({ score, metric });
  };

  const handleSaveEdit = (updatedScore: ScoreData) => {
    if (onUpdateScore) {
      onUpdateScore(updatedScore);
    }
    setEditingScore(null);
  };

  const renderTableSection = (title: string, sectionMetrics: Metric[]) => {
    if (sectionMetrics.length === 0) return null;

    return (
      <>
        {sectionMetrics.map((metric, index) => (
          <tr key={metric.id} className="border-b hover:bg-accent/50 transition-colors">
            {index === 0 && (
              <td
                rowSpan={sectionMetrics.length + 1}
                className="p-4 font-bold text-xs bg-muted/30 border-r align-top sticky left-0 z-10"
              >
                {title}
              </td>
            )}
            <td className="p-4 text-xs font-medium">{metric.category}</td>
            <td className="p-4 text-xs text-muted-foreground">{metric.description}</td>
            <td className="p-4 text-xs font-mono text-muted-foreground">
              {isEditable  ? (
                <input
                  type="text"
                  value={metric.criteria}
                  onChange={(e) => onUpdateMetric?.({ ...metric, criteria: e.target.value })}
                  className="bg-transparent border-b border-transparent hover:border-primary/30 focus:border-primary outline-none w-full transition-colors font-mono"
                  placeholder="Edit criteria..."
                />
              ) : (
                metric.criteria
              )}
            </td>
            {filteredRetailers.map(retailer => {
              const scoreData = scores.find(s => s.metricId === metric.id && s.retailerId === retailer.id);
              return (
                <td key={retailer.id} className="p-4 text-center">
                  {scoreData ? (
                    <ScoreBubble 
                      scoreData={scoreData} 
                      metric={metric} 
                      onClick={() => handleScoreClick(scoreData, metric)}
                      isEditable={isEditable}
                    />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
        <tr className="border-b bg-primary/5">
          <td className="p-4 text-xs font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            AI Insights
          </td>
          <td colSpan={2} className="p-4 text-xs text-muted-foreground italic">
            AI-generated performance analysis and recommendations
          </td>
          {filteredRetailers.map(retailer => (
            <td key={retailer.id} className="p-4 text-center">
              <button
                onClick={() => onOpenAiInsights(title, retailer.id)}
                className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                View
              </button>
            </td>
          ))}
        </tr>
      </>
    );
  };

  const greenCount = scores.filter(s => s.score >= 80).length;
  const yellowCount = scores.filter(s => s.score >= 60 && s.score < 80).length;
  const redCount = scores.filter(s => s.score < 60).length;
  const totalCount = scores.length || 1;

  const greenPct = (greenCount / totalCount) * 100;
  const yellowPct = (yellowCount / totalCount) * 100;
  const redPct = (redCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
       <div
  className="p-2 bg-card border rounded-xl flex items-center justify-around shadow-md cursor-pointer overflow-hidden
  transform-gpu will-change-transform origin-center
  transition-all duration-200 ease-out
  group-hover:scale-[1.02]
  group-hover:shadow-[0_30px_40px_-20px_rgba(79,75,229,0.28)]
  group-hover:border-indigo-100"
>
  
  {/* Left Side - Average Score */}
  <div className="flex flex-col">
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
      Average Score
    </p>

    <div className="flex items-baseline gap-1">
      <p className="text-3xl font-black text-primary">
        {Math.round(
          scores.reduce((acc, s) => acc + s.score, 0) /
          (scores.length || 1)
        )}
      </p>
      <span className="text-xl font-bold text-muted-foreground">%</span>
    </div>
  </div>

  {/* Right Side - Images */}
  <div className="grid grid-cols-2 gap-2 ml-4">
    <img src={bestbuylogo} className="w-12 h-12 object-contain" />
    <img src={amazonlogo} className="w-12 h-12 object-contain" />
    <img src={walmartlogo} className="w-12 h-12 object-contain" />
    <img src={costcologo} className="w-12 h-12 object-contain" />
  </div>

</div>
       

        <div className="p-2 bg-card border rounded-xl  space-y-2  shadow-md cursor-pointer overflow-hidden
          transform-gpu will-change-transform origin-center
          transition-all duration-200 ease-out
          group-hover:scale-[1.02]
          group-hover:shadow-[0_30px_40px_-20px_rgba(79,75,229,0.28)]
          group-hover:border-indigo-100">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Score Distribution</p>
          <div className="space-y-2">
            <div className="space-y-0.5">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-green-600 dark:text-green-400">Good</span>
                <span>{greenCount}</span>
              </div>
              <TooltipWrapper content={`Good: ${greenCount} metrics (${Math.round(greenPct)}%)`}>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${greenPct}%` }}
                    className="h-full bg-green-500"
                  />
                </div>
              </TooltipWrapper>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-yellow-600 dark:text-yellow-400">Average</span>
                <span>{yellowCount}</span>
              </div>
              <TooltipWrapper content={`Average: ${yellowCount} metrics (${Math.round(yellowPct)}%)`}>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${yellowPct}%` }}
                    className="h-full bg-yellow-500"
                  />
                </div>
              </TooltipWrapper>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-red-600 dark:text-red-400">Critical</span>
                <span>{redCount}</span>
              </div>
              <TooltipWrapper content={`Critical: ${redCount} metrics (${Math.round(redPct)}%)`}>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${redPct}%` }}
                    className="h-full bg-red-500"
                  />
                </div>
              </TooltipWrapper>
            </div>
          </div>
        </div>

        <div className="p-2 bg-card border rounded-xl flex flex-col justify-center items-center text-center space-y-3  shadow-md cursor-pointer overflow-hidden
          transform-gpu will-change-transform origin-center
          transition-all duration-200 ease-out
          group-hover:scale-[1.02]
          group-hover:shadow-[0_30px_40px_-20px_rgba(79,75,229,0.28)]
          group-hover:border-indigo-100">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Strategic Analysis</p>
            <p className="text-[9px] text-muted-foreground">Generate AI insights</p>
          </div>
          <button
            onClick={onOpenOverallAiInsights}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group text-sm"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            Overall AI Insights
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm bg-card">
      <table className="w-full border-collapse min-w-250">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="p-4 text-left text-[11px] font-bold uppercase tracking-wider sticky left-0 z-20 bg-muted/50 border-r">ONLINE/IN-STORE</th>
            <th className="p-4 text-left text-[11px] font-bold uppercase tracking-wider">CATEGORY</th>
            <th className="p-4 text-left text-[11px] font-bold uppercase tracking-wider">DESCRIPTION</th>
            <th className="p-4 text-left text-[11px] font-bold uppercase tracking-wider border-r">CRITERIA</th>
            {filteredRetailers.map(retailer => (
              <th key={retailer.id} className="p-4 text-center text-[11px] font-bold uppercase tracking-wider min-w-30">
                <div className="flex flex-col items-center gap-2">
                  {retailer.logoUrl && (
                    <img src={retailer.logoUrl} alt={retailer.name} className="h-6 object-contain" referrerPolicy="no-referrer" />
                  )}
                  <span>{retailer.name}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">SCORE</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderTableSection('ONLINE', onlineMetrics)}
          {renderTableSection('IN-STORE', inStoreMetrics)}
        </tbody>
      </table>
      </div>

      <AnimatePresence>
        {editingScore && (
          <EditScoreModal 
            score={editingScore.score} 
            metric={editingScore.metric} 
            onClose={() => setEditingScore(null)}
            onSave={handleSaveEdit}
            isEditable={isEditable}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TooltipWrapper({ children, content }: { children: React.ReactNode, content: string }) {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover border rounded-lg shadow-xl text-[10px] font-bold whitespace-nowrap z-60 text-popover-foreground"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b rotate-45 -translate-y-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreBubble({ scoreData, metric, onClick, isEditable }: { scoreData: ScoreData, metric: Metric, onClick: () => void, isEditable: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isYesNo = metric.criteria === 'Yes = Green';
  const isRating = metric.category === 'Ratings & Reviews';

  const displayValue = isYesNo 
    ? (scoreData.score >= 80 ? 'Yes' : 'No')
    : isRating 
      ? (scoreData.score / 20).toFixed(1)
      : scoreData.score;

  return (
    <div className="relative flex items-center justify-center gap-2">
      <button
        onClick={onClick}
        className={cn(
          "w-4 h-4 rounded-full transition-all shadow-sm flex items-center justify-center group hover:scale-125", 
          getBubbleColor(scoreData.score)
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Edit3 size={10} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      <span className="text-xs font-medium">{displayValue}</span>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-2 w-48 p-3 bg-popover border rounded-lg shadow-xl z-50 text-left pointer-events-none"
          >
            <h4 className="text-xs font-bold border-b pb-1 mb-2">{metric.category}</h4>
            <div className="space-y-1">
              <p className="text-xs flex justify-between">
                <span className="text-muted-foreground">Value:</span>
                <span className="font-bold">{displayValue}</span>
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-2">
                {scoreData.comments}
              </p>
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover border-r border-b rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditScoreModal({ score, metric, onClose, onSave, isEditable }: { score: ScoreData, metric: Metric, onClose: () => void, onSave: (score: ScoreData) => void, isEditable: boolean }) {
  const isYesNo = metric.criteria === 'Yes = Green';
  const isRating = metric.category === 'Ratings & Reviews';

  const [value, setValue] = useState(score.score);
  const [comment, setComment] = useState(score.comments);

  const handleYesNoChange = (val: 'Yes' | 'No') => {
    setValue(val === 'Yes' ? 100 : 0);
  };

  const handleRatingChange = (val: number) => {
    setValue(val * 20);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-card border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-4 border-b flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Edit {isEditable ? 'Score & Comment' : 'Comment'}</h2>
              <p className="text-xs text-muted-foreground">{metric.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={cn("space-y-2", !isEditable && "opacity-60 pointer-events-none")}>
            <label className="text-sm font-bold flex items-center justify-between">
              {isYesNo ? 'Status' : isRating ? 'Rating (1-5)' : 'Performance Score (0-100)'}
              {!isEditable && <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">Admin Only</span>}
            </label>
            
            {isYesNo ? (
              <div className="flex gap-2">
                {(['Yes', 'No'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleYesNoChange(option)}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold border-2 transition-all",
                      (option === 'Yes' ? value >= 80 : value < 80)
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        : "bg-background border-border hover:border-primary/50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : isRating ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={value / 20}
                    onChange={(e) => setValue(Number(e.target.value) * 20)}
                    disabled={!isEditable}
                    className="flex-1 accent-primary"
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={Number((value / 20).toFixed(1))}
                    onChange={(e) => setValue(Number(e.target.value) * 20)}
                    disabled={!isEditable}
                    className="w-20 px-3 py-2 bg-background border rounded-xl font-bold text-center focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="flex justify-between px-1 text-[10px] text-muted-foreground font-bold">
                  <span>1.0</span>
                  <span>2.0</span>
                  <span>3.0</span>
                  <span>4.0</span>
                  <span>5.0</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  disabled={!isEditable}
                  className="flex-1 accent-primary"
                />

                 {/* Text Input */}
    <input
      type="text"
      min="0"
      max="100"
      value={value}
      onChange={(e) =>
        setValue(Math.min(100, Math.max(0, Number(e.target.value))))
      }
      disabled={!isEditable}
      className="w-14 px-2 py-1 border rounded-md text-center text-sm font-semibold"
    />

                <span className={cn(
                  "w-12 h-8 rounded-md flex items-center justify-center font-black text-xs shadow-inner",
                  getBubbleColor(value),
                  "text-white"
                )}>
                  {value}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Analyst Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter detailed observations..."
              className="w-full h-32 p-4 bg-muted/30 border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-4 border-t bg-muted/30 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 border rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...score, score: value, comments: comment })}
            className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
