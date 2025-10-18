/**
 * API Key Service
 * Manages user's OpenAI API key for BYOK (Bring Your Own Key) model
 */

export class APIKeyService {
  private static instance: APIKeyService;
  private readonly STORAGE_KEY = 'openai_api_key';

  private constructor() {}

  public static getInstance(): APIKeyService {
    if (!APIKeyService.instance) {
      APIKeyService.instance = new APIKeyService();
    }
    return APIKeyService.instance;
  }

  /**
   * Check if user has an API key configured
   */
  public hasAPIKey(): boolean {
    const key = localStorage.getItem(this.STORAGE_KEY);
    return !!key && key.length > 0;
  }

  /**
   * Get user's API key
   */
  public getAPIKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Validate API key format
   */
  public isValidFormat(key: string): boolean {
    return key.startsWith('sk-') && key.length > 20;
  }

  /**
   * Save API key to localStorage
   */
  public saveAPIKey(key: string): void {
    if (!this.isValidFormat(key)) {
      throw new Error('Invalid API key format. OpenAI keys should start with "sk-"');
    }
    localStorage.setItem(this.STORAGE_KEY, key);
  }

  /**
   * Remove API key from localStorage
   */
  public removeAPIKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Validate API key by making a test call to OpenAI
   */
  public async validateAPIKey(key: string): Promise<{ valid: boolean; message: string }> {
    if (!this.isValidFormat(key)) {
      return {
        valid: false,
        message: 'Invalid API key format. OpenAI keys should start with "sk-"'
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return {
          valid: true,
          message: 'API key is valid and ready to use'
        };
      } else if (response.status === 401) {
        return {
          valid: false,
          message: 'Invalid API key. Please check your key and try again.'
        };
      } else {
        return {
          valid: false,
          message: `API validation error: ${response.status}`
        };
      }
    } catch (error) {
      return {
        valid: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  /**
   * Get masked API key for display (sk-...xyz)
   */
  public getMaskedKey(): string | null {
    const key = this.getAPIKey();
    if (!key) return null;
    
    if (key.length <= 10) return '***';
    
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
  }
}

// Export singleton instance
export const apiKeyService = APIKeyService.getInstance();

// Export convenience functions
export const hasAPIKey = () => apiKeyService.hasAPIKey();
export const getAPIKey = () => apiKeyService.getAPIKey();
export const saveAPIKey = (key: string) => apiKeyService.saveAPIKey(key);
export const removeAPIKey = () => apiKeyService.removeAPIKey();
export const validateAPIKey = (key: string) => apiKeyService.validateAPIKey(key);
export const getMaskedKey = () => apiKeyService.getMaskedKey();
export const isValidAPIKeyFormat = (key: string) => apiKeyService.isValidFormat(key);
