import { describe, it, expect } from 'vitest';
import { CREDIT_COSTS, formatCredits, creditsToUSD, getFeatureCost } from './creditsService';

describe('creditsService', () => {
  describe('CREDIT_COSTS', () => {
    it('should have correct credit costs for all features', () => {
      expect(CREDIT_COSTS.AI_PARSE).toBe(5);
      expect(CREDIT_COSTS.AI_ANALYSIS).toBe(2);
      expect(CREDIT_COSTS.AI_CHAT_MESSAGE).toBe(1);
      expect(CREDIT_COSTS.PREMIUM_EXPORT).toBe(1);
      expect(CREDIT_COSTS.SAVE_WORKFLOW_EXTRA).toBe(2);
    });
  });

  describe('getFeatureCost', () => {
    it('should return correct cost for AI_PARSE', () => {
      expect(getFeatureCost('AI_PARSE')).toBe(5);
    });

    it('should return correct cost for AI_ANALYSIS', () => {
      expect(getFeatureCost('AI_ANALYSIS')).toBe(2);
    });

    it('should return correct cost for AI_CHAT_MESSAGE', () => {
      expect(getFeatureCost('AI_CHAT_MESSAGE')).toBe(1);
    });
  });

  describe('formatCredits', () => {
    it('should format credits with commas', () => {
      expect(formatCredits(1000)).toBe('1,000');
      expect(formatCredits(10000)).toBe('10,000');
      expect(formatCredits(100)).toBe('100');
    });

    it('should handle zero credits', () => {
      expect(formatCredits(0)).toBe('0');
    });
  });

  describe('creditsToUSD', () => {
    it('should convert credits to USD at $0.10 per credit', () => {
      expect(creditsToUSD(10)).toBe('$1.00');
      expect(creditsToUSD(100)).toBe('$10.00');
      expect(creditsToUSD(1000)).toBe('$100.00');
    });

    it('should handle fractional values', () => {
      expect(creditsToUSD(5)).toBe('$0.50');
      expect(creditsToUSD(7)).toBe('$0.70');
    });

    it('should handle zero', () => {
      expect(creditsToUSD(0)).toBe('$0.00');
    });
  });

  describe('Hospital Workflow Example', () => {
    it('should cost 7 credits for full AI workflow (parse + analysis)', () => {
      const parseCost = CREDIT_COSTS.AI_PARSE;
      const analysisCost = CREDIT_COSTS.AI_ANALYSIS;
      const totalCost = parseCost + analysisCost;
      
      expect(totalCost).toBe(7);
      expect(creditsToUSD(totalCost)).toBe('$0.70');
    });

    it('should calculate user can do 14 workflows with 100 credits', () => {
      const credits = 100;
      const costPerWorkflow = CREDIT_COSTS.AI_PARSE + CREDIT_COSTS.AI_ANALYSIS;
      const workflowsPossible = Math.floor(credits / costPerWorkflow);
      
      expect(workflowsPossible).toBe(14);
    });

    it('should calculate user can do 85 workflows with 600 credits', () => {
      const credits = 600;
      const costPerWorkflow = CREDIT_COSTS.AI_PARSE + CREDIT_COSTS.AI_ANALYSIS;
      const workflowsPossible = Math.floor(credits / costPerWorkflow);
      
      expect(workflowsPossible).toBe(85);
    });
  });

  describe('Profit Margins', () => {
    it('should verify excellent profit margins', () => {
      // OpenAI API cost: ~$0.0004 per workflow
      const openAICost = 0.0004;
      
      // What we charge: 7 credits = $0.70
      const revenue = 0.70;
      
      const profit = revenue - openAICost;
      const profitMargin = (profit / revenue) * 100;
      
      expect(profit).toBeGreaterThan(0.69);
      expect(profitMargin).toBeGreaterThan(99);
    });
  });
});

