import { type IAreaHandler, type AreaConfig } from './types';
import { DharaviHandler } from './areas/dharavi/handler';

// Registry of all available area handlers
class AreaRegistry {
  private handlers: Map<string, IAreaHandler> = new Map();

  constructor() {
    this.registerAreas();
  }

  private registerAreas() {
    // Register Dharavi handler
    const dharaviHandler = new DharaviHandler();
    this.handlers.set('dharavi', dharaviHandler);

    // Future areas can be registered here:
    // const anotherAreaHandler = new AnotherAreaHandler();
    // this.handlers.set('another-area', anotherAreaHandler);
  }

  getHandler(areaId: string): IAreaHandler | undefined {
    return this.handlers.get(areaId.toLowerCase());
  }

  getAllAreas(): AreaConfig[] {
    return Array.from(this.handlers.values())
      .map(handler => handler.getAreaInfo())
      .filter(config => config.enabled);
  }

  getAreaIds(): string[] {
    return Array.from(this.handlers.keys());
  }

  isAreaSupported(areaId: string): boolean {
    return this.handlers.has(areaId.toLowerCase());
  }
}

// Export singleton instance
export const areaRegistry = new AreaRegistry();
