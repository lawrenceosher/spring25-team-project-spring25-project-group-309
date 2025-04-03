import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import { DatabaseTask } from '@fake-stack-overflow/shared';
import { RoadmapGraphProps } from '../../../../types/clientTypes/task';

/**
 * Get the color based on the priority
 * @param priority  The priority of the task
 * @returns  The color code based on the priority, default is blue
 */
const getPriorityColor = (priority: number) => {
  const colors: { [key: string]: string } = {
    High: '#ff4d4d',
    Medium: '#ffcc00',
    Low: '#3399ff',
  };
  // Return blue color if priority is not in the list
  return colors[priority] || '#007bff';
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
const RoadmapGraph: React.FC<RoadmapGraphProps> = ({ tasks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || tasks.length === 0) return;

    const nodes = new DataSet(
      tasks.map(task => ({
        id: task._id,
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

    const edges = new DataSet(
      tasks.flatMap((task, index) =>
        task.dependentTasks.map((dep: DatabaseTask) => ({
          id: `edge-${index}-${dep._id}-${task._id}`,
          from: dep._id,
          to: task._id,
          arrows: 'to',
          width: 2,
          smooth: { enabled: true, type: 'curvedCW', roundness: 0.2 },
        })),
      ),
    );

    networkRef.current = new Network(
      containerRef.current,
      { nodes, edges },
      {
        layout: { hierarchical: false },
        nodes: { shape: 'box', size: 20 },
        edges: {
          arrows: { to: { enabled: true, scaleFactor: 1.2 } },
          color: '#000',
        },
        interaction: { dragView: true, zoomView: true },
        physics: { enabled: true, solver: 'barnesHut', stabilization: false },
      },
    );
  }, [tasks]);

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-bold mb-4'>Task Dependency Roadmap</h2>
      <div ref={containerRef} style={{ height: '500px', border: '1px solid #ddd' }} />
    </div>
  );
};

export default RoadmapGraph;
