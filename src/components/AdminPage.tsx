import React, { useState, useMemo } from 'react';
import { Metric, Retailer, ScoreData } from '../types';
import { Plus, Save, Trash2, Edit2, Check, X, ArrowLeft, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { getScoreStatus } from '../constants';
import Overview from './Overview';

interface AdminPageProps {
  metrics: Metric[];
  retailers: Retailer[];
  scores: ScoreData[];
  onUpdateScore: (score: ScoreData) => void;
  onUpdateMetric: (metric: Metric) => void;
  onAddDate: (date: string) => void;
  currentRegion: string;
  onResetData: () => void;
}

export default function AdminPage({ metrics, retailers, scores, onUpdateScore, onUpdateMetric, onAddDate, currentRegion, onResetData }: AdminPageProps) {
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [isAddingNewDate, setIsAddingNewDate] = useState(false);
  const [activeNewDate, setActiveNewDate] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<{ isOpen: boolean; storeType: string; retailerId: string }>({
    isOpen: false,
    storeType: '',
    retailerId: '',
  });

  // Column Filters
  const [filters, setFilters] = useState({
    metric: '',
    retailer: '',
    date: '',
    region: '',
    score: '',
    comment: ''
  });

  const filteredScores = scores.filter(score => {
    const metric = metrics.find(m => m.id === score.metricId);
    const retailer = retailers.find(r => r.id === score.retailerId);
    
    const metricMatch = !filters.metric || 
      (metric?.category || '').toLowerCase().includes(filters.metric.toLowerCase()) ||
      (metric?.storeType || '').toLowerCase().includes(filters.metric.toLowerCase());
      
    const retailerMatch = !filters.retailer || 
      (retailer?.name || '').toLowerCase().includes(filters.retailer.toLowerCase());
      
    const dateMatch = !filters.date || 
      (score.date || '').includes(filters.date);
      
    const regionMatch = !filters.region || 
      (score.region || '').toLowerCase().includes(filters.region.toLowerCase());
      
    const scoreMatch = !filters.score || 
      (score.score?.toString() || '').includes(filters.score);
      
    const commentMatch = !filters.comment || 
      (score.comments || '').toLowerCase().includes(filters.comment.toLowerCase());
    
    return metricMatch && retailerMatch && dateMatch && regionMatch && scoreMatch && commentMatch;
  });

  const handleEdit = (score: ScoreData) => {
    setEditingScore(`${score.metricId}-${score.retailerId}-${score.date}-${score.region}`);
    setEditValue(score.score);
    setEditComment(score.comments);
  };

  const handleSave = (score: ScoreData) => {
    onUpdateScore({
      ...score,
      score: editValue,
      comments: editComment
    });
    setEditingScore(null);
  };

  const handleStartNewDate = () => {
    if (newDate) {
      onAddDate(newDate);
      setActiveNewDate(newDate);
      setIsAddingNewDate(true);
      setNewDate('');
    }
  };

  if (isAddingNewDate && activeNewDate) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
  
  {/* Left Side */}
  <div className="flex items-center gap-4">
    <div>
      <h2 className="text-3xl font-black tracking-tight">
        New Reporting Period
      </h2>
      <div className="flex items-center gap-2 text-primary font-bold">
        <Calendar size={16} />
        {activeNewDate}
      </div>
    </div>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-3">
    
    <button
      onClick={() => setIsAddingNewDate(false)}
      className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
    >
      <Check size={20} />
      Finish Entry
    </button>

    <button
      onClick={() => setIsAddingNewDate(false)}
      className="p-2 hover:bg-accent rounded-full transition-colors"
    >
      <ArrowLeft size={24} />
    </button>

  </div>

</div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-6">
            Enter scores for all retailers and metrics for the new period. Click on any score bubble to edit its value and add comments.
          </p>
          <Overview
            metrics={metrics}
            retailers={retailers}
            scores={scores.filter(s => s.date === activeNewDate && s.region === currentRegion)}
            selectedRetailer="All Retailers"
            selectedStoreType="All"
            onOpenAiInsights={() => {}}
            onUpdateScore={onUpdateScore}
            onUpdateMetric={onUpdateMetric}
            isEditable={true}
             onOpenOverallAiInsights={() => setAiInsights({ isOpen: true, storeType: 'All', retailerId: '' })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground font-medium">Manage retail metrics, scores, and reporting periods.</p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-card border rounded-2xl shadow-sm">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Add New Reporting Date</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-3 py-1.5 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <button
                onClick={handleStartNewDate}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <h3 className="font-bold">Metric Scores Management</h3>
            <div className="flex items-center gap-3">
              {Object.values(filters).some(v => v !== '') && (
                <button 
                  onClick={() => setFilters({ metric: '', retailer: '', date: '', region: '', score: '', comment: '' })}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}
              <div className="w-px h-4 bg-border mx-1" />
              {/* <button 
                onClick={onResetData}
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 size={14} />
                Reset Data
              </button> */}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b text-left">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    <div className="space-y-2">
                      <span>Metric</span>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.metric}
                        onChange={(e) => setFilters({ ...filters, metric: e.target.value })}
                        className="w-full px-2 py-1 bg-background border rounded font-normal text-[10px]"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    <div className="space-y-2">
                      <span>Retailer</span>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.retailer}
                        onChange={(e) => setFilters({ ...filters, retailer: e.target.value })}
                        className="w-full px-2 py-1 bg-background border rounded font-normal text-[10px]"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    <div className="space-y-2">
                      <span>Date</span>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="w-full px-2 py-1 bg-background border rounded font-normal text-[10px]"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    <div className="space-y-2">
                      <span>Region</span>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.region}
                        onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                        className="w-full px-2 py-1 bg-background border rounded font-normal text-[10px]"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    <div className="space-y-2">
                      <span>Score</span>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.score}
                        onChange={(e) => setFilters({ ...filters, score: e.target.value })}
                        className="w-full px-2 py-1 bg-background border rounded font-normal text-[10px]"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider">
                    <div className="space-y-2">
                      <span>Comments</span>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.comment}
                        onChange={(e) => setFilters({ ...filters, comment: e.target.value })}
                        className="w-full px-2 py-1 bg-background border rounded font-normal text-[10px]"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredScores.slice().reverse().map((score) => {
                  const metric = metrics.find(m => m.id === score.metricId);
                  const retailer = retailers.find(r => r.id === score.retailerId);
                  const isEditing = editingScore === `${score.metricId}-${score.retailerId}-${score.date}-${score.region}`;

                  return (
                    <tr key={`${score.metricId}-${score.retailerId}-${score.date}-${score.region}`} className="hover:bg-accent/50 transition-colors">
                      <td className="p-4 text-sm font-medium">{metric?.category}</td>
                      <td className="p-4 text-sm">{retailer?.name}</td>
                      <td className="p-4 text-sm font-mono text-muted-foreground">{score.date}</td>
                      <td className="p-4 text-sm font-medium">{score.region}</td>
                      <td className="p-4 text-sm">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            {metric?.criteria === 'Yes = Green' ? (
                              <div className="flex gap-1">
                                {(['Yes', 'No'] as const).map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => setEditValue(opt === 'Yes' ? 100 : 0)}
                                    className={cn(
                                      "px-2 py-1 text-[10px] font-bold border rounded transition-colors",
                                      (opt === 'Yes' ? editValue >= 80 : editValue < 80)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:border-primary/50"
                                    )}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            ) : metric?.category === 'Ratings & Reviews' ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  step="0.1"
                                  value={Number((editValue / 20).toFixed(1))}
                                  onChange={(e) => setEditValue(Number(e.target.value) * 20)}
                                  className="w-16 px-2 py-1 border rounded bg-background text-xs font-bold"
                                />
                                <span className="text-[10px] text-muted-foreground">/ 5</span>
                              </div>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editValue}
                                onChange={(e) => setEditValue(Number(e.target.value))}
                                className="w-20 px-2 py-1 border rounded bg-background"
                              />
                            )}
                          </div>
                        ) : (
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-bold",
                            getScoreStatus(score.score, metric?.criteria) === 'good' ? "bg-green-100 text-green-700" :
                            getScoreStatus(score.score, metric?.criteria) === 'average' ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {metric?.criteria === 'Yes = Green' 
                              ? (score.score >= 80 ? 'Yes' : 'No')
                              : metric?.category === 'Ratings & Reviews'
                                ? (score.score / 20).toFixed(1)
                                : score.score
                            }
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full px-2 py-1 border rounded bg-background"
                          />
                        ) : (
                          <span className="text-muted-foreground line-clamp-1">{score.comments}</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleSave(score)} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                              <Check size={18} />
                            </button>
                            <button onClick={() => setEditingScore(null)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleEdit(score)} className="p-1.5 text-primary hover:bg-primary/10 rounded">
                            <Edit2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
