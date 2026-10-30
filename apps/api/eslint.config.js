import tsParser from '@typescript-eslint/parser';

export default [{
  files: ['src/**/*.ts'],
  languageOptions: { parser: tsParser, parserOptions: { sourceType: 'module' } },
  rules: { 'no-restricted-imports': ['error', { paths: [{ name: '@supabase/supabase-js', message: 'Use the first-party Sylpace API. Supabase is legacy-only.' }, { name: '@supabase/ssr', message: 'Use the first-party Sylpace API. Supabase is legacy-only.' }] }] },
}];
