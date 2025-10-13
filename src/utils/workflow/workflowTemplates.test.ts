import { describe, it, expect } from 'vitest';
import { 
  WORKFLOW_TEMPLATES,
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
  getTemplateById,
  searchTemplates,
  getPopularTemplates
} from './workflowTemplates';

describe('workflowTemplates', () => {
  it('should have 10 templates', () => {
    expect(WORKFLOW_TEMPLATES).toHaveLength(10);
  });

  it('should have 8 categories', () => {
    expect(TEMPLATE_CATEGORIES).toHaveLength(8);
  });

  describe('getTemplatesByCategory', () => {
    it('should return templates for Customer Service category', () => {
      const templates = getTemplatesByCategory('Customer Service');
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every(t => t.category === 'Customer Service')).toBe(true);
    });

    it('should return templates for Sales category', () => {
      const templates = getTemplatesByCategory('Sales');
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every(t => t.category === 'Sales')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const templates = getTemplatesByCategory('Non-Existent');
      expect(templates).toHaveLength(0);
    });
  });

  describe('getTemplateById', () => {
    it('should return template by ID', () => {
      const template = getTemplateById('customer-onboarding');
      expect(template).toBeDefined();
      expect(template?.id).toBe('customer-onboarding');
      expect(template?.name).toBe('Customer Onboarding');
    });

    it('should return undefined for non-existent ID', () => {
      const template = getTemplateById('non-existent-id');
      expect(template).toBeUndefined();
    });
  });

  describe('searchTemplates', () => {
    it('should find templates by name keyword', () => {
      const results = searchTemplates('onboarding');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(t => t.name.toLowerCase().includes('onboarding'))).toBe(true);
    });

    it('should find templates by tag', () => {
      const results = searchTemplates('customer');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const lowerResults = searchTemplates('customer');
      const upperResults = searchTemplates('CUSTOMER');
      expect(lowerResults.length).toBe(upperResults.length);
    });

    it('should return empty array for non-matching keyword', () => {
      const results = searchTemplates('xyzabc123notfound');
      expect(results).toHaveLength(0);
    });
  });

  describe('getPopularTemplates', () => {
    it('should return 5 templates by default', () => {
      const templates = getPopularTemplates();
      expect(templates).toHaveLength(5);
    });

    it('should return requested number of templates', () => {
      const templates = getPopularTemplates(3);
      expect(templates).toHaveLength(3);
    });

    it('should sort by complexity (simple first)', () => {
      const templates = getPopularTemplates();
      const complexities = templates.map(t => t.complexity);
      // Simple templates should come first
      const firstTemplate = templates[0];
      expect(['simple', 'moderate'].includes(firstTemplate.complexity)).toBe(true);
    });
  });

  describe('Template Structure', () => {
    it('should have all required fields', () => {
      WORKFLOW_TEMPLATES.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('category');
        expect(template).toHaveProperty('steps');
        expect(template).toHaveProperty('estimatedTime');
        expect(template).toHaveProperty('complexity');
        expect(template).toHaveProperty('icon');
        expect(template).toHaveProperty('tags');
      });
    });

    it('should have valid complexity levels', () => {
      const validComplexities = ['simple', 'moderate', 'complex'];
      WORKFLOW_TEMPLATES.forEach(template => {
        expect(validComplexities).toContain(template.complexity);
      });
    });

    it('should have steps with required fields', () => {
      WORKFLOW_TEMPLATES.forEach(template => {
        expect(template.steps.length).toBeGreaterThan(0);
        template.steps.forEach(step => {
          expect(step).toHaveProperty('text');
          expect(step.text.length).toBeGreaterThan(0);
        });
      });
    });
  });
});

