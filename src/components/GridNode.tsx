import React from 'react';
import { Node, TerrainType } from '../types';

interface GridNodeProps {
  node: Node;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  isAnimating: boolean;
}

const TERRAIN_STYLES: Record<TerrainType, string> = {
  normal: 'bg-gray-100',
  sand: 'bg-yellow-200',
  water: 'bg-cyan-200',
  mountain: 'bg-gray-400',
};

const TERRAIN_COSTS: Record<TerrainType, number> = {
  normal: 1,
  sand: 2,
  water: 3,
  mountain: 4,
};

export const GridNode: React.FC<GridNodeProps> = ({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isAnimating,
}) => {
  const getNodeClassName = (): string => {
    const baseClasses = 'w-7 h-7 border border-gray-600 cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-bold select-none relative';
    
    if (node.isStart) return `${baseClasses} bg-green-500 text-white shadow-lg`;
    if (node.isEnd) return `${baseClasses} bg-red-500 text-white shadow-lg`;
    if (node.isWall) return `${baseClasses} bg-black`;
    if (node.isPath) return `${baseClasses} bg-yellow-400 shadow-lg`;
    if (node.isVisited) {
      // For visited nodes, show green background but preserve terrain styling with border
      return `${baseClasses} bg-green-300 ${node.terrain !== 'normal' ? 'border-2 border-green-500' : ''}`;
    }
    
    return `${baseClasses} ${TERRAIN_STYLES[node.terrain]} hover:bg-gray-200 hover:shadow-sm`;
  };

  const getNodeContent = (): string => {
    if (node.isStart) return 'S';
    if (node.isEnd) return 'E';
    if (node.isWall) return '';
    
    // Always show terrain cost for non-normal terrain, even when visited or on path
    if (node.terrain !== 'normal') {
      return TERRAIN_COSTS[node.terrain].toString();
    }
    
    return '';
  };

  const getTextColor = (): string => {
    if (node.isStart || node.isEnd) return 'text-white';
    if (node.isVisited || node.isPath) {
      // Use darker text for better contrast on green/yellow backgrounds
      return 'text-gray-900 font-extrabold';
    }
    return 'text-gray-700';
  };

  return (
    <div
      className={`${getNodeClassName()} ${getTextColor()}`}
      onMouseDown={() => onMouseDown(node.row, node.col)}
      onMouseEnter={() => onMouseEnter(node.row, node.col)}
      onMouseUp={onMouseUp}
      title={`(${node.row}, ${node.col}) - ${node.terrain} (cost: ${TERRAIN_COSTS[node.terrain]})`}
    >
      {getNodeContent()}
    </div>
  );
};