import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HeroInput = ({ selectedToolMode }) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState('upload'); // 'upload', 'claim', 'url'
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
      setTab('claim');
    } else if (selectedToolMode === 'url') {
      setTab('url');
    } else {
      setTab('upload');
    }
  }, [selectedToolMode]);

  const handleFile = (selected) => {
    setError('');
    if (!selected) return;

    // Validate size (up to 100 MB)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (selected.size > MAX_SIZE) {
      setError(t('hero.errSize', 'File exceeds 100 MB limit.'));
      return;
    }

    // Validate type (MP4, MOV, JPG, PNG, MP3, WAV, etc.)
    const validTypes = [
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska',
      'image/jpeg', 'image/png', 'image/webp',
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a', 'audio/aac'
    ];
    const validExtensions = /\.(mp4|mov|avi|mkv|webm|jpg|jpeg|png|webp|mp3|wav|m4a|ogg|aac)$/i;
    if (!validTypes.includes(selected.type) && !validExtensions.test(selected.name)) {
      setError(t('hero.errType', 'Please upload an MP4, MOV, JPG, PNG, MP3, or WAV file.'));
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
      if (tab === 'upload') {
        if (!file) {
          setError(t('hero.errSelectMedia', 'Please select or drop a media file first.'));
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
      } else if (tab === 'claim') {
        if (!textContent.trim()) {
          setError(t('hero.errEnterClaim', 'Please enter a claim text to verify.'));
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
      } else if (tab === 'url') {
        if (!urlContent.trim()) {
          setError(t('hero.errProvideUrl', 'Please provide a valid URL.'));
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

  const tabsList = [
    { id: 'upload', label: t('hero.tabUpload', 'Upload file') },
    { id: 'claim', label: t('hero.tabClaim', 'Paste text or claim') },
    { id: 'url', label: t('hero.tabUrl', 'Paste URL') },
  ];

  return (
    <div className="flex flex-col gap-[20px]">
      {/* 1. Hero */}
      <div className="text-center pt-[8px] px-[24px] pb-0">
        <h1 className="text-[38px] leading-[1.2] font-bold text-[#0F172A] tracking-tight sm:text-[38px] max-sm:text-[28px]">
          {t('hero.titleLine1', 'Investigate the media.')}
          <span className="text-[#4F46E5] block">{t('hero.titleLine2', 'Verify the message.')}</span>
        </h1>
        <p className="text-[15px] text-[#475569] mt-[12px] max-w-xl mx-auto leading-relaxed">
          {t('hero.subtitle', 'A swarm of AI agents checks video, image, audio and claims, then explains its verdict.')}
        </p>
      </div>

      {/* 2. Input card */}
      <div className="bg-white rounded-[20px] p-[22px] shadow-[0_8px_24px_rgba(79,70,229,0.10)] border border-[#E2E8F0]">
        {/* Tabs row */}
        <div className="flex flex-wrap gap-[8px] mb-[14px]" role="tablist" aria-label="Input mode">
          {tabsList.map((tabItem) => {
            const isActive = tab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setTab(tabItem.id);
                  setError('');
                }}
                className={
                  isActive
                    ? 'bg-[#4F46E5] text-white border border-[#4F46E5] font-medium text-[13px] py-[8px] px-[14px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
                    : 'bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
                }
              >
                {tabItem.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Dropzone */}
        {tab === 'upload' && (
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
              accept="video/*,image/*,audio/*,.mp4,.mov,.jpg,.jpeg,.png,.mp3,.wav,.m4a,.ogg"
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
                    className="p-1 hover:bg-gray-200 rounded-full text-gray-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[12px] text-[#475569]">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · {t('hero.readyForInvestigation', 'Ready for investigation')}
                </span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-[#4F46E5] mb-2" />
                <span className="font-bold text-[16px] text-[#0F172A]">
                  {t('hero.dropzoneTitle', 'Drag and drop video, audio, or image')}
                </span>
                <span className="text-[12px] text-[#475569] mt-[4px]">
                  {t('hero.dropzoneSubtitle', 'MP4, MP3, WAV, JPG, PNG · up to 100 MB')}
                </span>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Paste text or claim */}
        {tab === 'claim' && (
          <div className="min-h-[148px] flex flex-col">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={t('hero.textareaPlaceholder', 'Paste speech transcript, viral post, or factual assertion to verify...')}
              className="w-full h-[148px] p-3 rounded-[14px] border border-[#CBD5E1] text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none font-sans"
            />
          </div>
        )}

        {/* Tab 3: Paste URL */}
        {tab === 'url' && (
          <div className="min-h-[148px] flex flex-col justify-center">
            <input
              type="url"
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
              placeholder={t('hero.urlPlaceholder', 'https://example.com/video-or-post...')}
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

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-[14px]">
          {/* Left group: muted "Try a sample:" + pills */}
          <div className="flex flex-wrap items-center gap-[6px]">
            <span className="text-[12px] text-[#475569] font-medium mr-[2px]">
              {t('hero.trySample', 'Try a sample:')}
            </span>
            <button
              type="button"
              onClick={() => handleSample('authentic_clip')}
              className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              {t('hero.sampleAuthentic', 'Authentic clip')}
            </button>
            <button
              type="button"
              onClick={() => handleSample('ai_generated_image')}
              className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              {t('hero.sampleAiImage', 'AI Image')}
            </button>
            <button
              type="button"
              onClick={() => handleSample('voice_clone_false_claim')}
              className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              {t('hero.sampleVoiceClone', 'Voice clone')}
            </button>
          </div>

          {/* Right: primary button "Analyze" */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isSubmitting}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-[14px] py-[12px] px-[20px] rounded-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 disabled:opacity-60 cursor-pointer ml-auto"
          >
            {isSubmitting ? t('hero.analyzingBtn', 'Analyzing...') : t('hero.analyzeBtn', 'Analyze')}
          </button>
        </div>
      </div>

      {/* 3. Centered muted note */}
      <p className="text-center text-[12px] text-[#475569] -mt-[8px]">
        {t('hero.disclaimer', 'Results are probabilistic. DeepTrace shows evidence, not certainty.')}
      </p>
    </div>
  );
};

export default HeroInput;
