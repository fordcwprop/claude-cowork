// vite.config.js
import { defineConfig } from "file:///sessions/upbeat-inspiring-galileo/mnt/macmini--claude-openclaw-copy/workspace/projects/pipeline-v2/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/upbeat-inspiring-galileo/mnt/macmini--claude-openclaw-copy/workspace/projects/pipeline-v2/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    allowedHosts: [".trycloudflare.com", "pipeline.cwprop.com"],
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const cfEmail = req.headers["cf-access-authenticated-user-email"];
            if (cfEmail) {
              proxyReq.setHeader("Cf-Access-Authenticated-User-Email", cfEmail);
            }
          });
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvdXBiZWF0LWluc3BpcmluZy1nYWxpbGVvL21udC9tYWNtaW5pLS1jbGF1ZGUtb3BlbmNsYXctY29weS93b3Jrc3BhY2UvcHJvamVjdHMvcGlwZWxpbmUtdjIvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy91cGJlYXQtaW5zcGlyaW5nLWdhbGlsZW8vbW50L21hY21pbmktLWNsYXVkZS1vcGVuY2xhdy1jb3B5L3dvcmtzcGFjZS9wcm9qZWN0cy9waXBlbGluZS12Mi9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvdXBiZWF0LWluc3BpcmluZy1nYWxpbGVvL21udC9tYWNtaW5pLS1jbGF1ZGUtb3BlbmNsYXctY29weS93b3Jrc3BhY2UvcHJvamVjdHMvcGlwZWxpbmUtdjIvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzQsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBhbGxvd2VkSG9zdHM6IFsnLnRyeWNsb3VkZmxhcmUuY29tJywgJ3BpcGVsaW5lLmN3cHJvcC5jb20nXSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJlOiAocHJveHkpID0+IHtcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2ZFbWFpbCA9IHJlcS5oZWFkZXJzWydjZi1hY2Nlc3MtYXV0aGVudGljYXRlZC11c2VyLWVtYWlsJ11cbiAgICAgICAgICAgIGlmIChjZkVtYWlsKSB7XG4gICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQ2YtQWNjZXNzLUF1dGhlbnRpY2F0ZWQtVXNlci1FbWFpbCcsIGNmRW1haWwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc2YsU0FBUyxvQkFBb0I7QUFDbmhCLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYyxDQUFDLHNCQUFzQixxQkFBcUI7QUFBQSxJQUMxRCxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxXQUFXLENBQUMsVUFBVTtBQUNwQixnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLFFBQVE7QUFDdEMsa0JBQU0sVUFBVSxJQUFJLFFBQVEsb0NBQW9DO0FBQ2hFLGdCQUFJLFNBQVM7QUFDWCx1QkFBUyxVQUFVLHNDQUFzQyxPQUFPO0FBQUEsWUFDbEU7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
