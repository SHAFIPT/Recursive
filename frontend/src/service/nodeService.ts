import { CreateNodeRequest } from '@/types/tree';
import { BackendNode } from '@/hooks/useTreeState';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class NodeService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/nodes${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error instanceof Error ? error : new Error('Network error occurred');
    }
  }

  async getAllNodes(): Promise<BackendNode[]> {
    return this.request<BackendNode[]>('');
  }

  async createNode(data: CreateNodeRequest): Promise<BackendNode> {
    const requestPayload = {
      name: data.name,
      parent: data.parentId ?? null,
    };
    
    console.log('Sending to backend:', requestPayload);
    
    return this.request<BackendNode>('', {
      method: 'POST',
      body: JSON.stringify(requestPayload),
    });
  }

  async deleteNode(id: string): Promise<void> {
    return this.request<void>(`/${id}`, {
      method: 'DELETE',
    });
  }
}

export const nodeService = new NodeService();
