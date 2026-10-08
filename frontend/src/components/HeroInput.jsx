import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, X } from 'lucide-react';

const HeroInput = ({ selectedToolMode }) => {
  const [tab, setTab] = useState('Upload file'); // 'Upload file', 'Paste text or claim', 'Paste URL'
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // If a tool was selected from ToolGrid, adapt the active tab
  React.useEffect(() => {
    if (!selectedToolMode) return;
    if (selectedToolMode === 'claim') {
      setTab('Paste text or claim');
    } else if (selectedToolMode === 'url') {
      setTab('Paste URL');
    } else {
      setTab('Upload file');
    }
  }, [selectedToolMode]);

  const handleFile = (selected) => {
    setError('');
    if (!selected) return;

    // Validate size (up to 100 MB)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (selected.size > MAX_SIZE) {
      setError('File exceeds 100 MB limit.');
      return;
    }

    // Validate type (MP4, MOV, JPG, PNG)
    const validTypes = ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png'];
    const validExtensions = /\.(mp4|mov|jpg|jpeg|png)$/i;
    if (!validTypes.includes(selected.type) && !validExtensions.test(selected.name)) {
      setError('Please upload an MP4, MOV, JPG, or PNG file.');
      return;
    }

    setFile(selected);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(selected);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      if (tab === 'Upload file') {
        if (!file) {
          setError('Please select or drop a media file first.');
          setIsSubmitting(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.analysisId) {
          navigate(`/investigate/${data.analysisId}`);
        } else {
          setError(data.error || 'Failed to start analysis.');
        }
      } else if (tab === 'Paste text or claim') {
        if (!textContent.trim()) {
          setError('Please enter a claim text to verify.');
          setIsSubmitting(false);
          return;
        }
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textContent.trim() })
        });
        const data = await res.json();
        if (data.analysisId) {
          navigate(`/investigate/${data.analysisId}`);
        } else {
          setError(data.error || 'Failed to start analysis.');
        }
      } else if (tab === 'Paste URL') {
        if (!urlContent.trim()) {
          setError('Please provide a valid URL.');
          setIsSubmitting(false);
          return;
        }
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlContent.trim() })
        });
        const data = await res.json();
        if (data.analysisId) {
          navigate(`/investigate/${data.analysisId}`);
        } else {
          setError(data.error || 'Failed to start analysis.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Orchestrator may be starting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSample = async (sampleName) => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/analyze/sample/${sampleName}`, { method: 'POST' });
      const data = await res.json();
      if (data.analysisId) {
        navigate(`/investigate/${data.analysisId}`);
      } else {
        setError('Sample analysis failed to initialize.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to sample runner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {/* 1. Hero (centered, padding 8px 24px 0) */}
      <div className="text-center pt-[8px] px-[24px] pb-0">
        <h1 className="text-[38px] leading-[1.15] font-bold text-[#0F172A] tracking-tight sm:text-[38px] max-sm:text-[30px]">
          Investigate the media.
          <span className="text-[#4F46E5] block">Verify the message.</span>
        </h1>
        <p className="text-[15px] text-[#475569] mt-[12px] max-w-xl mx-auto leading-relaxed">
          A swarm of AI agents checks video, image, audio and claims, then explains its verdict.
        </p>
      </div>

      {/* 2. Input card (white bg, radius 20px, padding 22px, shadow 0 8px 24px rgba(79,70,229,.10), 1px #E2E8F0 border) */}
      <div className="bg-white rounded-[20px] p-[22px] shadow-[0_8px_24px_rgba(79,70,229,0.10)] border border-[#E2E8F0]">
        {/* Tabs row (gap 8px, margin-bottom 14px) as pills */}
        <div className="flex flex-wrap gap-[8px] mb-[14px]" role="tablist" aria-label="Input mode">
          {['Upload file', 'Paste text or claim', 'Paste URL'].map((tabName) => {
            const isActive = tab === tabName;
            return (
              <button
                key={tabName}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setTab(tabName);
                  setError('');
                }}
                className={
                  isActive
                    ? 'bg-[#4F46E5] text-white border border-[#4F46E5] font-medium text-[13px] py-[8px] px-[14px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
                    : 'bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
                }
              >
                {tabName}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Dropzone */}
        {tab === 'Upload file' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-[14px] py-[34px] px-[20px] text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              isDragging
                ? 'border-[#4F46E5] bg-[#EEF2FF]'
                : file
                ? 'border-[#4F46E5] bg-[#F5F7FF]'
                : 'border-[#A5B4FC] bg-[#F5F7FF] hover:border-[#4F46E5]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,image/jpeg,image/png,.mp4,.mov,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-[#CBD5E1] shadow-sm mb-1"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-1">
                    <File className="w-6 h-6" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-[#0F172A] max-w-xs truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={clearFile}
                    aria-label="Remove selected file"
                    className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[12px] text-[#475569]">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for investigation
                </span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-[#4F46E5] mb-2" />
                <span className="font-bold text-[16px] text-[#0F172A]">
                  Drag and drop a video or image
                </span>
                <span className="text-[12px] text-[#475569] mt-[4px]">
                  MP4, MOV, JPG, PNG · up to 100 MB
                </span>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Paste text or claim */}
        {tab === 'Paste text or claim' && (
          <div className="min-h-[148px] flex flex-col">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste speech transcript, viral post, or factual assertion to verify..."
              className="w-full h-[148px] p-3 rounded-[14px] border border-[#CBD5E1] text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none font-sans"
            />
          </div>
        )}

        {/* Tab 3: Paste URL */}
        {tab === 'Paste URL' && (
          <div className="min-h-[148px] flex flex-col justify-center">
            <input
              type="url"
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
              placeholder="https://example.com/video-or-article-url"
              className="w-full p-3.5 rounded-[14px] border border-[#CBD5E1] text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent font-sans"
            />
            <span className="text-[12px] text-[#475569] mt-2 px-1">
              Supports public articles, news URLs, and video link endpoints.
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[12px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Bottom row (space-between, margin-top 14px) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-[14px]">
          {/* Left group: muted "Try a sample:" + pills */}
          <div className="flex flex-wrap items-center gap-[6px]">
            <span className="text-[12px] text-[#475569] font-medium mr-[2px]">
              Try a sample:
            </span>
            <button
              type="button"
              onClick={() => handleSample('authentic_clip')}
              className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              Authentic clip
            </button>
            <button
              type="button"
              onClick={() => handleSample('ai_generated_image')}
              className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              AI image
            </button>
            <button
              type="button"
              onClick={() => handleSample('voice_clone_false_claim')}
              className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              Voice clone
            </button>
          </div>

          {/* Right: primary button "Analyze" */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isSubmitting}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-[14px] py-[12px] px-[20px] rounded-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 disabled:opacity-60 cursor-pointer ml-auto"
          >
            {isSubmitting ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* 3. Centered muted note */}
      <p className="text-center text-[12px] text-[#475569] -mt-[8px]">
        Results are probabilistic. DeepTrace shows evidence, not certainty.
      </p>
    </div>
  );
};

export default HeroInput;
