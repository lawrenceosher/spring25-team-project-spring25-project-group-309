import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import { DatabaseTask } from '@fake-stack-overflow/shared';
import { RoadmapGraphProps } from '../../../../types/clientTypes/task';

const getPriorityColor = (priority: number) => {
  const colors: { [key: string]: string } = {
    High: '#ff4d4d',
    Medium: '#ffcc00',
    Low: '#3399ff',
  };
  return colors[priority] || '#007bff';
};

type ExtendedProps = RoadmapGraphProps & {
  onTaskClick?: (taskId: string) => void;
};

const RoadmapGraph: React.FC<ExtendedProps> = ({ tasks, onTaskClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !Array.isArray(tasks) || tasks.length === 0) return;

    const frameId = requestAnimationFrame(() => {
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
          interaction: { dragView: true, zoomView: true },
        },
      );

      // Click handler
      networkRef.current.on('click', params => {
        if (params.nodes.length > 0) {
          const clickedId = params.nodes[0];
          onTaskClick?.(clickedId);
        }
      });
    });
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
