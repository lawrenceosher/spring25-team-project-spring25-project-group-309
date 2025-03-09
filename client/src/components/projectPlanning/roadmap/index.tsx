import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

const FAKETASKS = [
  { id: 'task-1', name: 'Design UI', dependsOn: [], priority: 1 },
  { id: 'task-2', name: 'Set up Backend', dependsOn: ['task-1'], priority: 2 },
  { id: 'task-3', name: 'API Integration', dependsOn: ['task-1', 'task-2'], priority: 3 },
  { id: 'task-4', name: 'Unit Testing', dependsOn: ['task-3'], priority: 4 },
  { id: 'task-5', name: 'Deployment', dependsOn: ['task-3', 'task-4'], priority: 5 },
];

const getPriorityColor = (priority: number) => {
  const colors: { [key: number]: string } = {
    1: '#ff4d4d',
    2: '#ffcc00',
    3: '#3399ff',
    4: '#33cc33',
    5: '#999999',
  };
  return colors[priority] || '#007bff';
};

const RoadmapGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = new DataSet(
      FAKETASKS.map(task => ({
        id: task.id,
        label: `${task.name}\n(Priority ${task.priority})`,
        shape: 'box',
        color: { background: getPriorityColor(task.priority), border: '#000' },
        font: { color: '#fff' },
        title: `Task: ${task.name}\nPriority: ${task.priority}`,
      })),
    );

    const edges = new DataSet(
      FAKETASKS.flatMap((task, index) =>
        task.dependsOn.map(dep => ({
          id: `edge-${index}-${dep}-${task.id}`,
          from: task.id,
          to: dep,
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
        edges: { arrows: { to: { enabled: true, scaleFactor: 1.2 } }, color: '#000000' },
        interaction: { dragNodes: true, dragView: true, zoomView: true },
        physics: { enabled: true, solver: 'barnesHut', stabilization: false },
      },
    );
  }, []);

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-xl fw-bold'>Project Roadmap (Graph View)</h2>
      <div ref={containerRef} style={{ height: '500px', border: '1px solid #ddd' }} />
    </div>
  );
};

export default RoadmapGraph;
