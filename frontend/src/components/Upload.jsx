import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Upload = () => {
  const [tab, setTab] = useState('file');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    if (file && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please upload a video or image file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (tab === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        response = await fetch('/api/analyze', { method: 'POST', body: formData });
      } else if (tab === 'text' && textContent.trim()) {
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textContent }),
        });
      } else if (tab === 'url' && urlContent.trim()) {
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlContent }),
        });
      } else {
        setError('Please provide input before analyzing.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.analysisId) {
        navigate(`/investigate/${data.analysisId}`);
      } else {
        setError('Unexpected server response.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is the orchestrator running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-2xl p-6 glow-cyan">
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
        {[
          { id: 'file', label: 'Upload File', Icon: UploadCloud },
          { id: 'text', label: 'Paste Text', Icon: FileText },
          { id: 'url', label: 'Paste URL', Icon: LinkIcon },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? 'bg-white/10 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="min-h-[200px] flex flex-col justify-center">
          {tab === 'file' && (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group ${
                dragOver ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-600 hover:border-cyan-400 hover:bg-cyan-400/5'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
              }}
            >
              <UploadCloud className="w-12 h-12 mx-auto text-gray-500 group-hover:text-cyan-400 mb-4" />
              {selectedFile ? (
                <>
                  <p className="text-cyan-400 font-medium">{selectedFile.name}</p>
                  <p className="text-gray-500 text-sm mt-1">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </>
              ) : (
                <>
                  <p className="text-gray-300 font-medium">Drag & drop your file here</p>
                  <p className="text-gray-500 text-sm mt-2">Supports Video (MP4) and Image (JPEG, PNG)</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="video/*,image/*"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          )}

          {tab === 'text' && (
            <textarea
              className="w-full h-40 bg-black/40 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
              placeholder="Paste the claim, news excerpt, or social media post here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          )}

          {tab === 'url' && (
            <input
              type="url"
              className="w-full bg-black/40 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="https://example.com/article-or-video-url"
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
            />
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Initializing...' : 'Analyze Now'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
