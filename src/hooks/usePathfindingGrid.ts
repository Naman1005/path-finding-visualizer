import { useState, useCallback, useRef } from 'react';
import { Node, GridDimensions, TerrainType, AlgorithmType, AlgorithmResult, BrushType } from '../types';
import { dijkstra, aStar, bfs, dfs } from '../utils/algorithms';

const INITIAL_START = { row: 10, col: 5 };
const INITIAL_END = { row: 10, col: 35 };

function createInitialGrid(dimensions: GridDimensions): Node[][] {
  const grid: Node[][] = [];
  
  for (let row = 0; row < dimensions.rows; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < dimensions.cols; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === INITIAL_START.row && col === INITIAL_START.col,
        isEnd: row === INITIAL_END.row && col === INITIAL_END.col,
        isWall: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
        terrain: 'normal',
      });
    }
    grid.push(currentRow);
  }
  
  return grid;
}

export function usePathfindingGrid(dimensions: GridDimensions) {
  const [grid, setGrid] = useState<Node[][]>(() => createInitialGrid(dimensions));
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [statistics, setStatistics] = useState<AlgorithmResult['statistics']>();
  const animationRef = useRef(false);

  const resetGrid = useCallback(() => {
    setGrid(createInitialGrid(dimensions));
    setStatistics(undefined);
  }, [dimensions]);

  const clearPath = useCallback(() => {
    setGrid(prevGrid => 
      prevGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousNode: null,
          heuristic: undefined,
          totalCost: undefined,
        }))
      )
    );
    setStatistics(undefined);
  }, []);

  const applyBrush = useCallback((row: number, col: number, brush: BrushType) => {
    setGrid(prevGrid =>
      prevGrid.map(gridRow =>
        gridRow.map(node => {
          if (node.row === row && node.col === col && !node.isStart && !node.isEnd) {
            if (brush === 'wall') {
              return { ...node, isWall: true, terrain: 'normal' };
            } else {
              return { ...node, isWall: false, terrain: brush as TerrainType };
            }
          }
          return node;
        })
      )
    );
  }, []);

  const handleMouseDown = useCallback((row: number, col: number, brush: BrushType) => {
    if (animationRef.current) return;
    
    const node = grid[row][col];
    
    if (node.isStart) {
      setIsDraggingStart(true);
    } else if (node.isEnd) {
      setIsDraggingEnd(true);
    } else {
      setIsMousePressed(true);
      applyBrush(row, col, brush);
    }
  }, [grid, applyBrush]);

  const handleMouseEnter = useCallback((row: number, col: number, brush: BrushType) => {
    if (animationRef.current) return;

    if (isDraggingStart) {
      setGrid(prevGrid =>
        prevGrid.map(gridRow =>
          gridRow.map(node => ({
            ...node,
            isStart: node.row === row && node.col === col,
          }))
        )
      );
    } else if (isDraggingEnd) {
      setGrid(prevGrid =>
        prevGrid.map(gridRow =>
          gridRow.map(node => ({
            ...node,
            isEnd: node.row === row && node.col === col,
          }))
        )
      );
    } else if (isMousePressed) {
      applyBrush(row, col, brush);
    }
  }, [isDraggingStart, isDraggingEnd, isMousePressed, applyBrush]);

  const handleMouseUp = useCallback(() => {
    setIsMousePressed(false);
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  }, []);

  const visualizeAlgorithm = useCallback(async (algorithm: AlgorithmType, speed: number) => {
    if (animationRef.current) return;

    // Clear previous path
    setGrid(prevGrid => 
      prevGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousNode: null,
          heuristic: undefined,
          totalCost: undefined,
        }))
      )
    );

    animationRef.current = true;
    setIsAnimating(true);

    // Create a fresh copy of the grid for the algorithm
    const gridCopy = grid.map(row => 
      row.map(node => ({
        ...node,
        distance: Infinity,
        previousNode: null,
        isVisited: false,
        isPath: false,
        heuristic: undefined,
        totalCost: undefined,
      }))
    );

    const startNode = gridCopy.flat().find(node => node.isStart)!;
    const endNode = gridCopy.flat().find(node => node.isEnd)!;

    let result: AlgorithmResult;

    switch (algorithm) {
      case 'dijkstra':
        result = dijkstra(gridCopy, startNode, endNode);
        break;
      case 'astar':
        result = aStar(gridCopy, startNode, endNode);
        break;
      case 'bfs':
        result = bfs(gridCopy, startNode, endNode);
        break;
      case 'dfs':
        result = dfs(gridCopy, startNode, endNode);
        break;
      default:
        result = dijkstra(gridCopy, startNode, endNode);
    }

    // Calculate delay based on speed (5-100 range, where 100 is fastest)
    // Much faster animation speeds
    const visitedDelay = Math.max(1, 105 - speed); // 1ms to 100ms
    const pathDelay = Math.max(5, visitedDelay * 1.5); // Slightly slower for path

    // Animate visited nodes
    for (let i = 0; i < result.visitedNodes.length; i++) {
      if (!animationRef.current) break; // Allow interruption
      
      await new Promise(resolve => setTimeout(resolve, visitedDelay));
      const node = result.visitedNodes[i];
      
      setGrid(prevGrid =>
        prevGrid.map(row =>
          row.map(n =>
            n.row === node.row && n.col === node.col && !n.isStart && !n.isEnd
              ? { ...n, isVisited: true }
              : n
          )
        )
      );
    }

    // Animate shortest path
    if (result.shortestPath.length > 0 && animationRef.current) {
      for (let i = 0; i < result.shortestPath.length; i++) {
        if (!animationRef.current) break; // Allow interruption
        
        await new Promise(resolve => setTimeout(resolve, pathDelay));
        const node = result.shortestPath[i];
        
        setGrid(prevGrid =>
          prevGrid.map(row =>
            row.map(n =>
              n.row === node.row && n.col === node.col && !n.isStart && !n.isEnd
                ? { ...n, isPath: true }
                : n
            )
          )
        );
      }
    }

    setStatistics(result.statistics);
    animationRef.current = false;
    setIsAnimating(false);
  }, [grid]);

  return {
    grid,
    isAnimating,
    statistics,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    visualizeAlgorithm,
    resetGrid,
    clearPath,
  };
}