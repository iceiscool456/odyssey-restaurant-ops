import { defineConfig } from 'orval';

export default defineConfig({
  odyssey: {
    input: '../../services/backend/openapi.json',
    output: {
      target: './src/generated/endpoints.ts',
      schemas: './src/generated/models',
      client: 'react-query',
      mode: 'tags-split',
      clean: true,
      override: {
        mutator: {
          path: './src/mutator/custom-fetch.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
