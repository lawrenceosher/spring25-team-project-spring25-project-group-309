/* eslint-disable consistent-return */
import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import { DatabaseTask } from '@fake-stack-overflow/shared';
import { RoadmapGraphProps } from '../../../../types/clientTypes/task';

/**
 * Get the color based on the task priority
 *
 * @param priority - The priority of the task
 * @returns  - The color associated with the priority
 */
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    High: '#FF4D4D',
    Medium: '#FFCC00',
    Low: '#3399FF',
  };

  return colors[priority] || '#FFFFFF'; // Default -- white
};

type ExtendedProps = RoadmapGraphProps & {
  onTaskClick?: (taskId: string) => void;
};

/**
 * Represents the RoadmapGraph component.
 * It displays the project roadmap in a graph view.
 *   - Each task is represented as a node
 *   - Each dependency is represented as an edge
 *     - Edges are directed from the dependent task to the task it depends on
 *   - The color of the node is based on the priority of the task
 *   - The higher the priority, the darker the color
 * @returns The RoadmapGraph component
 */
const RoadmapGraph: React.FC<ExtendedProps> = ({ tasks, onTaskClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !Array.isArray(tasks) || tasks.length === 0) return;

    const frameId = requestAnimationFrame(() => {
      // Create a new DataSet for nodes
      const nodes = new DataSet(
        tasks.map(task => ({
          id: task._id.toString(),
          label: `${task.name}\n(Priority: ${task.priority})`,
          shape: 'box',
          color: {
            background: getPriorityColor(task.priority),
            border: '#000',
          },
          font: { color: '#fff' },
          title: `Task: ${task.name}\nPriority: ${task.priority}`,
        })),
      );

      // Create a new DataSet for edges
      // If Task B depends on Task A, then there is an edge from A->B
      const edges = new DataSet(
        tasks.flatMap((task, index) =>
          task.dependentTasks.map((dep: DatabaseTask | string) => ({
            id: `edge-${index}-${typeof dep === 'object' ? dep._id : dep}-${task._id}`,
            from: typeof dep === 'object' ? dep._id.toString() : dep.toString(),
            to: task._id.toString(),
            arrows: 'to',
            width: 2,
            smooth: { enabled: true, type: 'curvedCW', roundness: 0.2 },
          })),
        ),
      );

      // Create a new network instance
      const network = new Network(
        containerRef.current!,
        { nodes, edges },
        {
          layout: {
            hierarchical: {
              enabled: true,
              direction: 'UD',
              sortMethod: 'directed',
              levelSeparation: 150,
              nodeSpacing: 120,
              treeSpacing: 200,
            },
          },
          physics: false,
          edges: {
            arrows: { to: { enabled: true, scaleFactor: 1.2 } },
            color: '#000',
          },
          nodes: {
            shape: 'box',
            size: 20,
          },
          interaction: {
            dragView: true,
            zoomView: true,
          },
        },
      );

      networkRef.current = network;

      // Handle task click
      network.on('click', params => {
        if (params.nodes.length > 0) {
          const clickedId = params.nodes[0];
          onTaskClick?.(clickedId.toString());
        }
      });
    });

    // Cleanup on unmount or rerender
    return () => {
      cancelAnimationFrame(frameId);
      networkRef.current?.destroy();
      networkRef.current = null;
    };
  }, [tasks, onTaskClick]);

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-bold mb-4'>Task Dependency Roadmap</h2>
      <div
        ref={containerRef}
        style={{
          height: '500px',
          border: '1px solid #ddd',
          contain: 'layout style size',
          overflow: 'auto',
        }}
      />
    </div>
  );
};

export default RoadmapGraph;
