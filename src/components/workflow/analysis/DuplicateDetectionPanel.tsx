/**
 * Duplicate Detection Panel Component  
 * Displays AI-detected duplicate steps with merge options
 */

import React, { useState } from 'react';

interface DuplicatePair {
  step1: any;
  step2: any;
  step1Index: number;
  step2Index: number;
  similarity: number;
  reasoning: string;
}

interface DuplicateDetectionPanelProps {
  duplicates: DuplicatePair[];
  onMergeSteps?: (step1Index: number, step2Index: number) => void;
  onKeepBoth?: (duplicateIndex: number) => void;
}

const DuplicateDetectionPanel: React.FC<DuplicateDetectionPanelProps> = ({
  duplicates,
  onMergeSteps,
  onKeepBoth
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mergedPairs, setMergedPairs] = useState<Set<number>>(new Set());

  if (!duplicates || duplicates.length === 0) return null;

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 0.9) return { text: 'Very High', color: '#d32f2f' };
    if (similarity >= 0.8) return { text: 'High', color: '#f57c00' };
    if (similarity >= 0.7) return { text: 'Medium', color: '#fbc02d' };
    return { text: 'Low', color: '#9e9e9e' };
  };

  const handleMerge = (dup: DuplicatePair, index: number) => {
    if (onMergeSteps) {
      onMergeSteps(dup.step1Index, dup.step2Index);
      setMergedPairs(prev => new Set(prev).add(index));
    }
  };

  const handleKeep = (index: number) => {
    if (onKeepBoth) {
      onKeepBoth(index);
      setMergedPairs(prev => new Set(prev).add(index));
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff9c4',
      border: '2px solid #fbc02d',
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
          paddingBottom: '10px',
          borderBottom: '2px solid #fbc02d',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#f57c00',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          <span style={{ fontSize: '20px' }}>🔗</span>
          <span>Duplicate Steps Detected</span>
          <span style={{
            backgroundColor: '#f57c00',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {duplicates.length}
          </span>
        </div>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#f57c00',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div>
          <p style={{
            margin: '0 0 15px 0',
            color: '#f57c00',
            fontSize: '13px',
            fontStyle: 'italic'
          }}>
            AI detected steps that appear to say the same thing in different words:
          </p>

          {duplicates.map((dup, index) => {
            const similarityInfo = getSimilarityLabel(dup.similarity);
            const isMerged = mergedPairs.has(index);

            return (
              <div
                key={index}
                style={{
                  backgroundColor: isMerged ? '#f5f5f5' : 'white',
                  border: '1px solid #fbc02d',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px',
                  opacity: isMerged ? 0.6 : 1
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #ffe082'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ color: '#f57c00' }}>Duplicate Pair {index + 1}</strong>
                    <span style={{
                      backgroundColor: similarityInfo.color,
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {similarityInfo.text} Similarity ({Math.round(dup.similarity * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Reasoning */}
                {dup.reasoning && (
                  <div style={{
                    backgroundColor: '#fff8e1',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '10px',
                    fontStyle: 'italic'
                  }}>
                    💡 {dup.reasoning}
                  </div>
                )}

                {/* Duplicate Steps */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{
                    backgroundColor: '#fff8e1',
                    border: '1px solid #ffd54f',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '8px'
                  }}>
                    <strong style={{ color: '#f57c00' }}>Step {dup.step1Index + 1}:</strong>{' '}
                    <span>{dup.step1.text}</span>
                    <span style={{
                      marginLeft: '10px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      Keep This
                    </span>
                  </div>

                  <div style={{
                    backgroundColor: '#fff8e1',
                    border: '1px solid #ffd54f',
                    borderRadius: '6px',
                    padding: '10px'
                  }}>
                    <strong style={{ color: '#f57c00' }}>Step {dup.step2Index + 1}:</strong>{' '}
                    <span>{dup.step2.text}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isMerged && (onMergeSteps || onKeepBoth) && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {onMergeSteps && (
                      <button
                        onClick={() => handleMerge(dup, index)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#ff9800',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
                      >
                        🔗 Merge into One
                      </button>
                    )}
                    {onKeepBoth && (
                      <button
                        onClick={() => handleKeep(index)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#9e9e9e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#757575'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9e9e9e'}
                      >
                        ✓ Keep Both
                      </button>
                    )}
                  </div>
                )}

                {isMerged && (
                  <div style={{
                    color: '#4caf50',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    ✓ Action taken
                  </div>
                )}
              </div>
            );
          })}

          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#fff8e1',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
          }}>
            💡 <strong>Tip:</strong> Merging duplicates helps keep your workflow clean and avoids redundancy.
          </div>
        </div>
      )}
    </div>
  );
};

export default DuplicateDetectionPanel;

