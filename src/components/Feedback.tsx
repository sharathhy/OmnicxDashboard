import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating && comment) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="space-y-3">
  <div className="flex items-center justify-between w-full relative">
    
    {/* Left - Icon + Title */}
    <div className="flex items-center gap-3">
      <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary">
        <MessageSquare size={28} />
      </div>
      <h2 className="text-2xl font-medium tracking-tight">
        Feedback
      </h2>
    </div>

    {/* Center - Description */}
    <p className="absolute left-1/2 -translate-x-1/2 text-lg text-muted-foreground text-center">
      Help us improve the OmniCx Dashboard experience.
    </p>

  </div>
</div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="feedback-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="p-6 bg-card border rounded-3xl shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">How would you rate your experience?</label>
              <div className="flex justify-between gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={cn(
                      "flex-1 p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      rating === num ? "border-primary bg-primary/5 text-primary scale-105 shadow-lg shadow-primary/10" : "hover:border-primary/50 hover:bg-accent"
                    )}
                  >
                    <Star size={24} fill={rating === num ? "currentColor" : "none"} />
                    <span className="text-xs font-bold">{num}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">What can we improve?</label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts, feature requests, or report issues..."
                className="w-full h-40 p-4 bg-background border rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!rating || !comment}
              className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Submit Feedback
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="feedback-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-card border rounded-3xl shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Thank you for your feedback!</h3>
              <p className="text-muted-foreground">Your input helps us build a better experience for everyone.</p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setRating(null);
                setComment('');
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all"
            >
              Send More Feedback
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
