import { useState } from 'react';
import { PREDEFINED_TAGS } from '../lib/predefinedTags';
import { Badge } from '@/components/ui/badge';

interface TagMultiSelectProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagMultiSelect({ selected, onChange }: TagMultiSelectProps) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PREDEFINED_TAGS.map(tag => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className="transition-all duration-200"
          >
            <Badge
              variant={isSelected ? 'default' : 'outline'}
              className={`cursor-pointer ${
                isSelected
                  ? 'bg-app-accent text-app-bg-primary border-app-accent'
                  : 'border-app-border text-app-text-secondary hover:border-app-accent'
              }`}
            >
              {tag}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
