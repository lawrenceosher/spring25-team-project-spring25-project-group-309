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

const RoadmapGraph: React.FC<RoadmapGraphProps> = ({ tasks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !Array.isArray(tasks) || tasks.length === 0) return;

    // Build a set of task IDs that are depended on
    const dependedOnIds = new Set<string>();
    tasks.forEach(task => {
      task.dependentTasks.forEach((dep: DatabaseTask) => dependedOnIds.add(dep._id.toString()));
    });

    // Filter tasks to only those involved in a dependency
    const filteredTasks = tasks.filter(
      task => task.dependentTasks.length > 0 || dependedOnIds.has(task._id),
    );

    if (filteredTasks.length === 0) return;

    const nodes = new DataSet(
      filteredTasks.map(task => ({
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
      filteredTasks.flatMap((task, index) =>
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
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'DU',
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
  }, [tasks]);

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-bold mb-4'>Task Dependency Roadmap</h2>
      <div ref={containerRef} style={{ height: '500px', border: '1px solid #ddd' }} />
    </div>
  );
};

export default RoadmapGraph;
