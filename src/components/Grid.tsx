import React from 'react';
import { Node } from '../types';
import { GridNode } from './GridNode';

interface GridProps {
  grid: Node[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  isAnimating: boolean;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isAnimating,
}) => {
  return (
    <div className="inline-block border-2 border-gray-600 bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((node, colIndex) => (
            <GridNode
              key={`${rowIndex}-${colIndex}`}
              node={node}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
              isAnimating={isAnimating}
            />
          ))}
        </div>
      ))}
    </div>
  );
};