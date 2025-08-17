import React from 'react'

type Props = {
  tags: string[];
  selectedTags?: string[];
  onToggle: (tag: string) => void;
  multiple?: boolean;
}

export default function TagFilter({ tags, selectedTags, onToggle, multiple }: Props) {
  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => {
        const isSelected = selectedTags?.includes(tag);

        const handleToggle = () => {
          if (multiple) {
            onToggle(tag);

          } else {
            onToggle(tag);
          }
        }

        return (
          <div onClick={handleToggle} className={`cursor-pointer px-4 py-1 rounded-full border text-sm transition-all
              ${isSelected ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}
            `}>
            {tag}
          </div>
        );
      })}
    </div>
  )
}