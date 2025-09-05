import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'material/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'materials/category/:category',
    renderMode: RenderMode.Server,
  },
  {
    path: 'materials/type/:type',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];