import React from 'react';
import { Video, Image as ImageIcon, Volume2, CheckCircle, Search, FileText } from 'lucide-react';

const TOOLS = [
  {
    id: 'video',
    title: 'Deepfake video check',
    description: 'Frames, face movement and audio together.',
    icon: Video,
    targetMode: 'upload'
  },
  {
    id: 'image',
    title: 'Image forensics',
    description: 'Pixel artifacts and a heatmap overlay.',
    icon: ImageIcon,
    targetMode: 'upload'
  },
  {
    id: 'audio',
    title: 'Voice clone check',
    description: 'Synthetic speech and lip-sync mismatch.',
    icon: Volume2,
    targetMode: 'upload'
  },
  {
    id: 'claim',
    title: 'Claim fact-check',
    description: 'Matches claims to real fact-checks.',
    icon: CheckCircle,
    targetMode: 'claim'
  },
  {
    id: 'source',
    title: 'Source match',
    description: 'Find the original with reverse search.',
    icon: Search,
    targetMode: 'upload'
  },
  {
    id: 'metadata',
    title: 'Metadata and report',
    description: 'Provenance details, exportable report.',
    icon: FileText,
    targetMode: 'upload'
  }
];

const ToolGrid = ({ onSelectTool }) => {
  return (
    <section id="explore" aria-label="Explore tools">
      {/* Section heading h3: 15px, 700, margin-bottom 12px */}
      <h3 className="text-[15px] font-bold text-[#0F172A] mb-[12px]">
        Explore tools
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
              className="bg-white border border-[#E2E8F0] rounded-[12px] p-[14px] flex flex-col gap-[6px] text-left hover:border-[#CBD5E1] hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
            >
              {/* icon box 30x30px radius 8px bg #EEF2FF with a 16px indigo (#4F46E5) stroke-2 icon */}
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#EEF2FF] flex items-center justify-center shrink-0">
                <Icon className="w-[16px] h-[16px] text-[#4F46E5] stroke-[2]" />
              </div>

              {/* title 700 14px */}
              <span className="font-bold text-[14px] text-[#0F172A]">
                {tool.title}
              </span>

              {/* description 12px #475569 */}
              <span className="text-[12px] text-[#475569] leading-normal">
                {tool.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ToolGrid;
