import React from 'react';
import { Video, Image as ImageIcon, Volume2, CheckCircle, Search, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TOOLS = [
  {
    id: 'video',
    titleKey: 'tools.videoTitle',
    descKey: 'tools.videoDesc',
    fallbackTitle: 'Deepfake video check',
    fallbackDesc: 'Frames, face movement and audio together.',
    icon: Video,
    targetMode: 'upload'
  },
  {
    id: 'image',
    titleKey: 'tools.imageTitle',
    descKey: 'tools.imageDesc',
    fallbackTitle: 'Image forensics',
    fallbackDesc: 'Pixel artifacts and a heatmap overlay.',
    icon: ImageIcon,
    targetMode: 'upload'
  },
  {
    id: 'audio',
    titleKey: 'tools.audioTitle',
    descKey: 'tools.audioDesc',
    fallbackTitle: 'Voice clone check',
    fallbackDesc: 'Synthetic speech and lip-sync mismatch.',
    icon: Volume2,
    targetMode: 'upload'
  },
  {
    id: 'claim',
    titleKey: 'tools.claimTitle',
    descKey: 'tools.claimDesc',
    fallbackTitle: 'Claim fact-check',
    fallbackDesc: 'Matches claims to real fact-checks.',
    icon: CheckCircle,
    targetMode: 'claim'
  },
  {
    id: 'source',
    titleKey: 'tools.sourceTitle',
    descKey: 'tools.sourceDesc',
    fallbackTitle: 'Source match',
    fallbackDesc: 'Find the original with reverse search.',
    icon: Search,
    targetMode: 'upload'
  },
  {
    id: 'metadata',
    titleKey: 'tools.metadataTitle',
    descKey: 'tools.metadataDesc',
    fallbackTitle: 'Metadata and report',
    fallbackDesc: 'Provenance details, exportable report.',
    icon: FileText,
    targetMode: 'upload'
  }
];

const ToolGrid = ({ onSelectTool }) => {
  const { t } = useLanguage();

  return (
    <section id="explore" aria-label="Explore tools">
      {/* Section heading */}
      <h3 className="text-[15px] font-bold text-[#0F172A] mb-[12px]">
        {t('tools.sectionTitle', 'Explore tools')}
      </h3>

      {/* 2-column grid (gap 12px) of 6 tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool && onSelectTool(tool.targetMode)}
              className="bg-white border border-[#E2E8F0] rounded-[12px] p-[14px] flex flex-col gap-[6px] text-left hover:border-[#CBD5E1] hover:shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              {/* icon box 30x30px radius 8px bg #EEF2FF */}
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#EEF2FF] flex items-center justify-center shrink-0">
                <Icon className="w-[16px] h-[16px] text-[#4F46E5] stroke-[2]" />
              </div>

              {/* title */}
              <span className="font-bold text-[14px] text-[#0F172A]">
                {t(tool.titleKey, tool.fallbackTitle)}
              </span>

              {/* description */}
              <span className="text-[12px] text-[#475569] leading-relaxed">
                {t(tool.descKey, tool.fallbackDesc)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ToolGrid;
