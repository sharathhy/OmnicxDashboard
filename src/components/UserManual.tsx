import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, AlertCircle, Info, HelpCircle, Upload, FileText, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface UserManualProps {
  isAdmin?: boolean;
}

const PPTViewer = ({ fileUrl }: { fileUrl: string }) => {
  const encodedUrl = encodeURIComponent(fileUrl);

  return (
    <iframe
      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`}
      width="100%"
      height="100%"
      className="border-0"
      title="PowerPoint Viewer"
    />
  );
};

export default function UserManual({ isAdmin = false }: UserManualProps) {
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [pptName, setPptName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('omnicx_ppt_name');
    } catch (e) {
      return null;
    }
  });

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (pptUrl && pptUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pptUrl);
      }
    };
  }, [pptUrl]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setError(null);

      // Simulate a small delay for the "uploading" feel
      setTimeout(() => {
        try {
          // Create a local URL for the uploaded file
          const localUrl = URL.createObjectURL(file);
          
          setPptUrl(localUrl);
          setPptName(file.name);
          
          // Note: We don't store the blob URL in localStorage because it expires
          // but we can store the name to remember what was "uploaded"
          localStorage.setItem('omnicx_ppt_name', file.name);
          setIsUploading(false);
        } catch (err) {
          console.error('Upload error:', err);
          setError('Failed to process the file. Please try a different one.');
          setIsUploading(false);
        }
      }, 800);
    }
  };

  const handleLoadExample = () => {
    setIsUploading(true);
    setError(null);
    
    setTimeout(() => {
      // Using a reliable public sample PPTX for the "Example"
      // This works with the Google Docs Viewer because it's a public URL
      const sampleUrl = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-pptx-file-for-testing.pptx";
      
      setPptUrl(sampleUrl);
      setPptName("OmniCx_Training_Demo.pptx");
      localStorage.setItem('omnicx_ppt_name', "OmniCx_Training_Demo.pptx");
      setIsUploading(false);
    }, 800);
  };

  const handleRemovePpt = () => {
    try {
      if (pptUrl && pptUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pptUrl);
      }
      setPptUrl(null);
      setPptName(null);
      localStorage.removeItem('omnicx_ppt_name');
    } catch (e) {
      console.error('Error removing PPT:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
  <div className="flex items-center justify-between w-full relative">
    
    {/* Left - Icon + Title */}
    <div className="flex items-center gap-3">
      <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary">
        <BookOpen size={28} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">
        User Manual
      </h2>
    </div>

    {/* Center - Description */}
    <p className="absolute left-1/2 -translate-x-1/2 text-lg text-muted-foreground text-center">
      Everything you need to know about the OmniCx Dashboard.
    </p>

  </div>
</div>

      <div className="grid gap-8">
        {/* PPT Viewer Section */}
        <section className="p-8 bg-card border rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <FileText size={24} className="text-primary" />
              Training Presentation
            </h3>
            {isAdmin && (
              <div className="flex items-center gap-3">
                {/* {!pptUrl && !isUploading && (
                  <button 
                    onClick={handleLoadExample}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-bold hover:bg-accent/80 transition-all border"
                  >
                    <Info size={18} />
                    Load Example
                  </button>
                )} */}
                {pptUrl && !isUploading && (
                  <button 
                    onClick={handleRemovePpt}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Remove PPT"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <label className={cn(
                  "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/20",
                  isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
                )}>
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {isUploading ? 'Uploading...' : (pptUrl ? 'Replace Presentation' : 'Upload Presentation')}
                  <input 
                    type="file" 
                    accept=".pdf,.ppt,.pptx" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    disabled={isUploading}
                    key={pptUrl || 'empty'} // Reset input on change
                  />
                </label>
              </div>
            )}
          </div>

          <div className="p-4 bg-blue-500/5 text-blue-600 dark:text-blue-400 rounded-xl flex items-center gap-3 text-xs font-medium border border-blue-500/10">
            <Info size={16} />
            Tip: Upload a PDF for the best in-dashboard preview experience.
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in zoom-in duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {pptUrl ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 text-orange-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{pptName || 'Training_Manual.pptx'}</p>
                    <p className="text-xs text-muted-foreground">Microsoft PowerPoint Presentation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={pptUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg text-xs font-bold hover:bg-accent transition-colors"
                  >
                    View Fullscreen
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <div className="aspect-video w-full rounded-2xl border overflow-hidden bg-muted shadow-inner relative group">
                {pptName?.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={pptUrl || ''}
                    className="w-full h-full"
                    frameBorder="0"
                    title="Presentation Viewer"
                  />
                ) : pptUrl?.startsWith('blob:') ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-linear-to-b from-muted/50 to-muted/20">
                    <div className="relative">
                      <div className="p-6 bg-orange-500/10 text-orange-600 rounded-3xl animate-pulse">
                        <FileText size={64} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-2 bg-background rounded-full border shadow-sm">
                        <CheckCircle2 size={20} className="text-green-500" />
                      </div>
                    </div>
                    <div className="max-w-md space-y-4">
                      <div>
                        <h4 className="text-xl font-bold">Local PowerPoint Ready</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your file "{pptName}" is ready.
                        </p>
                      </div>
                      <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl text-[11px] text-orange-600 dark:text-orange-400 text-left space-y-2">
                        <p className="font-bold flex items-center gap-2">
                          <Info size={14} />
                          Note on Local Files
                        </p>
                        <p className="leading-relaxed">
                          Google's viewer cannot see files stored only on your computer. To preview this file, please <strong>Open / Download</strong> it, or upload a <strong>PDF</strong> for a direct preview.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a 
                          href={pptUrl || ''} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                          <ExternalLink size={18} />
                          Open / Download
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <PPTViewer fileUrl={pptUrl || ''} />
                )}
                {/* <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="text-xs font-bold text-muted-foreground bg-card px-4 py-2 rounded-full border shadow-sm">
                    If the preview doesn't load, use the "View Fullscreen" button above.
                  </p>
                </div> */}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-muted/20 space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <FileText size={48} className="text-muted-foreground opacity-20" />
              </div>
              <div className="text-center">
                <p className="font-bold text-muted-foreground">No presentation uploaded yet.</p>
                {isAdmin && <p className="text-xs text-muted-foreground">Upload a PPT to share it with the team.</p>}
              </div>
            </div>
          )}
        </section>

        <section className="p-8 bg-card border rounded-3xl shadow-sm space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Info size={24} className="text-primary" />
            Getting Started
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                Overview Page
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The main dashboard displays retail metrics across Online and In-Store categories. Use the header dropdowns to filter by Retailer, Region, Date, and Store Type.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                AI Insights
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Click the "View" button in the AI Insights row to generate a comprehensive analysis of a retailer's performance. You can download these insights as PDF or Word.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                Training Previews
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For the best experience, upload your training materials as <strong>PDFs</strong>. This allows them to be viewed directly inside the dashboard. PowerPoint files will be available for download.
              </p>
            </div>
          </div>
        </section>

        <section className="p-8 bg-card border rounded-3xl shadow-sm space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Shield size={24} className="text-primary" />
            Admin Features
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl border-l-4 border-primary">
              <p className="text-sm font-medium">Only users with the "Admin" role can access the Admin and Privilege Access pages.</p>
            </div>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
                <div className="p-1 bg-primary/10 rounded text-primary mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-medium">Edit metric scores and comments directly in the Admin page.</span>
              </li>
              <li className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
                <div className="p-1 bg-primary/10 rounded text-primary mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-medium">Add new reporting dates to track performance over time.</span>
              </li>
              <li className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
                <div className="p-1 bg-primary/10 rounded text-primary mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-medium">Manage user privileges and assign admin roles via email.</span>
              </li>
              <li className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
                <div className="p-1 bg-primary/10 rounded text-primary mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-medium">Upload and manage training presentations for the team.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="p-8 bg-card border rounded-3xl shadow-sm space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <HelpCircle size={24} className="text-primary" />
            Understanding Scores
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center space-y-2">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto" />
              <p className="text-sm font-bold text-green-700">Good (80-100)</p>
              <p className="text-xs text-green-600/80">Metric is performing above target thresholds.</p>
            </div>
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-center space-y-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto" />
              <p className="text-sm font-bold text-yellow-700">Average (60-79)</p>
              <p className="text-xs text-yellow-600/80">Metric is stable but has room for improvement.</p>
            </div>
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-2">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto" />
              <p className="text-sm font-bold text-red-700">Critical (0-59)</p>
              <p className="text-xs text-red-600/80">Metric requires immediate strategic attention.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Shield({ size, className }: { size: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
