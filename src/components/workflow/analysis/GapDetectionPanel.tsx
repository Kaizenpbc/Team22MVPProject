/**
 * Gap Detection Panel Component
 * Displays AI-detected missing steps with "Add" buttons
 */

import React, { useState } from 'react';

interface GapSuggestion {
  suggestion: string;
  reason: string;
  priority: string;
  description?: string;
  impact?: string;
}

interface GapDetectionPanelProps {
  missingSteps: GapSuggestion[];
  addedSteps?: string[];
  onAddStep?: (stepText: string, index: number) => void;
}

const GapDetectionPanel: React.FC<GapDetectionPanelProps> = ({
  missingSteps,
  addedSteps = [],
  onAddStep
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!missingSteps || missingSteps.length === 0) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return { bg: '#ffebee', border: '#ef5350', text: '#b71c1c' };
      case 'HIGH': return { bg: '#fff3e0', border: '#ffb74d', text: '#e65100' };
      case 'MEDIUM': return { bg: '#fff9c4', border: '#fbc02d', text: '#f57c00' };
      case 'LOW': return { bg: '#f1f8e9', border: '#aed581', text: '#558b2f' };
      default: return { bg: '#fff3e0', border: '#ffb74d', text: '#e65100' };
    }
  };

  const mainColor = getPriorityColor('HIGH'); // Orange for overall panel

  return (
    <div style={{
      backgroundColor: mainColor.bg,
      border: `2px solid ${mainColor.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? '15px' : '0',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: mainColor.text,
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span>Possible Missing Steps</span>
          <span style={{
            backgroundColor: mainColor.text,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {missingSteps.length}
          </span>
        </div>
        <button style={{
          background: 'none',
          border: 'none',
          color: mainColor.text,
          cursor: 'pointer',
          fontSize: '18px'
        }}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div>
          <p style={{
            margin: '0 0 15px 0',
            color: mainColor.text,
            fontSize: '13px',
            fontStyle: 'italic'
          }}>
            AI analysis suggests these steps might be missing from your workflow:
          </p>

          {missingSteps.map((gap, index) => {
            const isAdded = addedSteps.includes(gap.suggestion);
            const colors = getPriorityColor(gap.priority);

            return (
              <div
                key={index}
                style={{
                  backgroundColor: isAdded ? '#f5f5f5' : 'white',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '10px',
                  opacity: isAdded ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px'
                    }}>
                      <span style={{
                        backgroundColor: colors.text,
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {gap.priority}
                      </span>
                      <strong style={{ color: '#333', fontSize: '14px' }}>
                        #{index + 1}: {gap.suggestion}
                      </strong>
                      {isAdded && (
                        <span style={{
                          color: '#4caf50',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>
                          ✓ Added
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      {gap.description || gap.reason}
                    </div>
                    {gap.impact && (
                      <div style={{
                        fontSize: '11px',
                        color: '#999',
                        fontStyle: 'italic'
                      }}>
                        Impact: {gap.impact}
                      </div>
                    )}
                  </div>

                  {onAddStep && (
                    <button
                      onClick={() => !isAdded && onAddStep(gap.suggestion, index)}
                      disabled={isAdded}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isAdded ? '#ccc' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isAdded ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={(e) => !isAdded && (e.currentTarget.style.backgroundColor = '#45a049')}
                      onMouseOut={(e) => !isAdded && (e.currentTarget.style.backgroundColor = '#4caf50')}
                    >
                      {isAdded ? '✓ Added' : '➕ Add'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666'
          }}>
            💡 <strong>Tip:</strong> These are AI suggestions based on your workflow logic. Review each to determine if it applies.
          </div>
        </div>
      )}
    </div>
  );
};

export default GapDetectionPanel;