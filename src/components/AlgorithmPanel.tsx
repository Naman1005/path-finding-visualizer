import React from 'react';
import { AlgorithmType } from '../types';
import { Zap, BarChart3 } from 'lucide-react';

interface AlgorithmPanelProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  isAnimating: boolean;
  statistics?: {
    nodesVisited: number;
    pathLength: number;
    executionTime: number;
    totalCost: number;
  };
}

const ALGORITHMS = [
  { id: 'dijkstra' as AlgorithmType, name: "Dijkstra's", description: 'Weighted shortest path' },
  { id: 'astar' as AlgorithmType, name: 'A* Search', description: 'Heuristic pathfinding' },
  { id: 'bfs' as AlgorithmType, name: 'BFS', description: 'Unweighted shortest' },
  { id: 'dfs' as AlgorithmType, name: 'DFS', description: 'Explores deeply first' },
];

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  isAnimating,
  statistics,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 space-y-6 h-full">
      <div>
        <h2 className="text-xl font-bold text-green-400 mb-2">Pathfinding Visualizer</h2>
        <p className="text-sm text-gray-400">Interactive algorithm visualization</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-500" />
          Algorithm
        </h3>
        <div className="space-y-3">
          {ALGORITHMS.map((algorithm) => (
            <label key={algorithm.id} className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value={algorithm.id}
                checked={selectedAlgorithm === algorithm.id}
                onChange={() => onAlgorithmChange(algorithm.id)}
                disabled={isAnimating}
                className="w-5 h-5 mt-0.5 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500 focus:ring-2"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-200 text-base group-hover:text-green-400 transition-colors">
                  {algorithm.name}
                </div>
                <div className="text-sm text-gray-400 leading-relaxed">
                  {algorithm.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {statistics && (
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Visited</div>
              <div className="font-semibold text-green-400 text-lg">{statistics.nodesVisited}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Length</div>
              <div className="font-semibold text-green-400 text-lg">{statistics.pathLength}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Cost</div>
              <div className="font-semibold text-green-400 text-lg">{statistics.totalCost.toFixed(1)}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Time</div>
              <div className="font-semibold text-green-400 text-lg">{statistics.executionTime}ms</div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-700 pt-6 text-sm text-gray-400 space-y-2">
        <div className="font-medium text-gray-300 mb-3">Quick Guide:</div>
        <div>• Select brush and click/drag to paint</div>
        <div>• Drag start (S) and end (E) to move them</div>
        <div>• Different terrains have movement costs</div>
        <div>• Walls completely block paths</div>
      </div>
    </div>
  );
};