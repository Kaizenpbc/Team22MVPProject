/**
 * Enhanced Workflow Flowchart
 * Interactive ReactFlow visualization with AI analysis overlays
 * Shows efficiency, risk, and gaps directly on nodes
 */

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowStep } from '../../../utils/workflow/workflowEditor';
import { ComprehensiveAnalysis } from '../../../utils/workflow/comprehensiveWorkflowAnalysis';

interface EnhancedWorkflowFlowchartProps {
  steps: WorkflowStep[];
  analysis?: ComprehensiveAnalysis | null;
}

const EnhancedWorkflowFlowchart: React.FC<EnhancedWorkflowFlowchartProps> = ({ 
  steps, 
  analysis 
}) => {
  
  // Get node color based on risk
  const getNodeColor = (stepIndex: number): string => {
    if (!analysis?.risks) return '#e3f2fd';
    
    const allRiskSteps = [
      ...analysis.risks.highRiskSteps,
      ...analysis.risks.mediumRiskSteps,
      ...analysis.risks.lowRiskSteps
    ];
    
    const stepRisk = allRiskSteps.find(r => r.index === stepIndex);
    if (!stepRisk) return '#e3f2fd';
    
    const colors: Record<string, string> = {
      high: '#ffebee',
      medium: '#fff3e0',
      low: '#f1f8e9'
    };
    return colors[stepRisk.category] || '#e3f2fd';
  };

  const getBorderColor = (stepIndex: number): string => {
    if (!analysis?.risks) return '#2196F3';
    
    const allRiskSteps = [
      ...analysis.risks.highRiskSteps,
      ...analysis.risks.mediumRiskSteps,
      ...analysis.risks.lowRiskSteps
    ];
    
    const stepRisk = allRiskSteps.find(r => r.index === stepIndex);
    if (!stepRisk) return '#2196F3';
    
    const colors: Record<string, string> = {
      high: '#f57c00',
      medium: '#fbc02d',
      low: '#689f38'
    };
    return colors[stepRisk.category] || '#2196F3';
  };

  const getRiskIcon = (stepIndex: number): string => {
    if (!analysis?.risks) return '';
    
    const allRiskSteps = [
      ...analysis.risks.highRiskSteps,
      ...analysis.risks.mediumRiskSteps,
      ...analysis.risks.lowRiskSteps
    ];
    
    const stepRisk = allRiskSteps.find(r => r.index === stepIndex);
    if (!stepRisk) return '';
    
    const icons: Record<string, string> = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return icons[stepRisk.category] || '';
  };

  const getEfficiencyScore = (stepIndex: number): number | null => {
    if (!analysis?.efficiency?.breakdown?.[stepIndex]) return null;
    return Math.round(analysis.efficiency.breakdown[stepIndex].stepEfficiency * 100);
  };

  const getStepTime = (stepIndex: number): number | null => {
    if (!analysis?.efficiency?.breakdown?.[stepIndex]) return null;
    return Math.round(analysis.efficiency.breakdown[stepIndex].estimatedTime);
  };

  // Build nodes
  const buildNodes = useMemo((): Node[] => {
    const nodes: Node[] = [];
    let yPosition = 100;

    // Start node
    nodes.push({
      id: 'start',
      type: 'input',
      data: {
        label: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>🚀</div>
            <div style={{ fontWeight: 'bold' }}>START</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Begin Process</div>
          </div>
        )
      },
      position: { x: 250, y: yPosition },
      style: {
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '12px',
        padding: '15px',
        width: 200
      }
    });

    yPosition += 150;

    // Workflow step nodes
    steps.forEach((step, index) => {
      const stepText = step.text || step.name || `Step ${index + 1}`;
      const nodeColor = getNodeColor(index);
      const borderColor = getBorderColor(index);
      const riskIcon = getRiskIcon(index);
      const effScore = getEfficiencyScore(index);
      const stepTime = getStepTime(index);
      const isDecision = step.type === 'decision' ||
                         stepText.toLowerCase().includes('if ') ||
                         stepText.toLowerCase().includes('?');

      nodes.push({
        id: `step-${index}`,
        type: 'default',
        data: {
          label: (
            <div style={{ padding: '10px' }}>
              <div style={{ 
                fontSize: '12px',
                color: '#999',
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>
                STEP {index + 1}
              </div>

              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#333'
              }}>
                {isDecision ? '🤔 ' : '📝 '}{stepText}
              </div>

              {(effScore !== null || riskIcon || stepTime !== null) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '11px',
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '8px'
                }}>
                  {effScore !== null && (
                    <div>
                      <span style={{ color: '#999' }}>Efficiency:</span>{' '}
                      <span style={{
                        fontWeight: 'bold',
                        color: effScore >= 80 ? '#4caf50' : effScore >= 60 ? '#ff9800' : '#f44336'
                      }}>
                        {effScore}%
                      </span>
                    </div>
                  )}

                  {riskIcon && (
                    <div>
                      <span style={{ color: '#999' }}>Risk:</span>{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {riskIcon}
                      </span>
                    </div>
                  )}

                  {stepTime !== null && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: '#999' }}>⏱️ Time:</span>{' '}
                      <span style={{ fontWeight: 'bold' }}>{stepTime} min</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        },
        position: { x: 200, y: yPosition },
        style: {
          backgroundColor: nodeColor,
          border: `3px solid ${borderColor}`,
          borderRadius: isDecision ? '50px' : '12px',
          width: 300,
          minHeight: 120
        }
      });

      yPosition += 200;
    });

    // End node
    nodes.push({
      id: 'end',
      type: 'output',
      data: {
        label: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>✅</div>
            <div style={{ fontWeight: 'bold' }}>END</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Process Complete</div>
          </div>
        )
      },
      position: { x: 250, y: yPosition },
      style: {
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '12px',
        padding: '15px',
        width: 200
      }
    });
    
    return nodes;
  }, [steps, analysis]);

  // Build edges
  const buildEdges = useMemo((): Edge[] => {
    const edges: Edge[] = [];

    if (steps.length === 0) return edges;

    // Start to first step
    edges.push({
      id: 'start-to-step-0',
      source: 'start',
      target: 'step-0',
      animated: true,
      style: { stroke: '#4caf50', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4caf50'
      }
    });

    // Connect steps
    for (let i = 0; i < steps.length - 1; i++) {
      edges.push({
        id: `step-${i}-to-step-${i + 1}`,
        source: `step-${i}`,
        target: `step-${i + 1}`,
        animated: true,
        style: { stroke: '#2196F3', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#2196F3'
        }
      });
    }

    // Last step to end
    edges.push({
      id: `step-${steps.length - 1}-to-end`,
      source: `step-${steps.length - 1}`,
      target: 'end',
      animated: true,
      style: { stroke: '#4caf50', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4caf50'
      }
    });

    return edges;
  }, [steps]);

  const [nodes] = useNodesState(buildNodes);
  const [edges] = useEdgesState(buildEdges);

  return (
    <div style={{ width: '100%', height: '800px', backgroundColor: '#fafafa', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
        fontSize: 11
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 10 }}>LEGEND</div>
        <div style={{ marginBottom: 5 }}>🟢 Low Risk</div>
        <div style={{ marginBottom: 5 }}>🟡 Medium Risk</div>
        <div style={{ marginBottom: 5 }}>🔴 High Risk</div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #e0e0e0' }}>
          <div style={{ marginBottom: 5 }}>Drag nodes to reposition</div>
          <div>Zoom with mouse wheel</div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#e0e0e0" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default EnhancedWorkflowFlowchart;

