import { X } from 'lucide-react';
import React from 'react'

type Props = {
  onClick: () => void;
  icon: 'X'
}

export default function ButtonIcon({ icon, onClick }: Props) {
  const IconComponent = { X }[icon];

  return (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1 cursor-pointer"
      aria-label="Close modal"
    >
      <IconComponent size={25} />
    </button>
  )
}