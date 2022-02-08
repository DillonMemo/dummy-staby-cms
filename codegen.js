const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')

module.exports = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_HTTP_LINK,
  documents: 'graphql/*.ts',

  generates: {
    'generated/index.tsx': {
      config: {
        reactApolloVersion: 3,
        withHooks: true,
      },
      plugins: [
        {
          add: {
            content:
              '// THIS IS A GENERATED FILE, use `npm run codegen` or `yarn codegen` to regenerate',
          },
        },
        { add: { content: '/* tslint:disable */' } },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
}
