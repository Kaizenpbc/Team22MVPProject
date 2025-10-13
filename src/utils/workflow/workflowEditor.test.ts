import { describe, it, expect } from 'vitest';
import { parseSteps, WorkflowStep } from './workflowEditor';

describe('workflowEditor', () => {
  describe('parseSteps', () => {
    it('should parse numbered steps correctly', () => {
      const sopText = `1. First step
2. Second step
3. Third step`;
      
      const result = parseSteps(sopText);
      
      expect(result).toHaveLength(3);
      expect(result[0].text).toBe('First step');
      expect(result[0].number).toBe(1);
      expect(result[1].text).toBe('Second step');
      expect(result[2].text).toBe('Third step');
    });

    it('should detect decision steps with "if"', () => {
      const sopText = `1. Check the value
2. If value is over 100, proceed to next step
3. Process the result`;
      
      const result = parseSteps(sopText);
      
      expect(result[1].type).toBe('decision');
    });

    it('should detect start steps', () => {
      const sopText = `1. Start the process
2. Continue with task`;
      
      const result = parseSteps(sopText);
      
      expect(result[0].type).toBe('start');
    });

    it('should detect end steps', () => {
      const sopText = `1. Do the task
2. Complete the workflow`;
      
      const result = parseSteps(sopText);
      
      expect(result[1].type).toBe('end');
    });

    it('should handle empty input', () => {
      const result = parseSteps('');
      expect(result).toHaveLength(0);
    });

    it('should handle steps with parentheses numbering', () => {
      const sopText = `1) First step
2) Second step`;
      
      const result = parseSteps(sopText);
      
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('First step');
    });

    it('should generate unique IDs for each step', () => {
      const sopText = `1. First
2. Second
3. Third`;
      
      const result = parseSteps(sopText);
      
      const ids = result.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });
});

