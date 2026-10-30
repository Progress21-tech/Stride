import { zodToJsonSchema } from 'zod-to-json-schema';
import { problemSchema } from '@sylpace/contracts';
import { authSchemas } from './identity/routes.js';

const schema = (value: Parameters<typeof zodToJsonSchema>[0]) => zodToJsonSchema(value, { target: 'openApi3' });

export const openApiDocument = {
  openapi: '3.1.0',
  info: { title: 'Sylpace API', version: '1.0.0', description: 'Versioned API for the Sylpace learning platform.' },
  paths: {
    '/healthz': { get: { summary: 'Liveness check', responses: { '200': { description: 'API process is alive.' } } } },
    '/readyz': { get: { summary: 'Readiness check', responses: { '200': { description: 'Required services are ready.' }, '503': { description: 'A required service is unavailable.' } } } },
    '/v1/auth/signup': { post: { summary: 'Request account creation', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Signup' } } } }, responses: { '202': { description: 'Generic signup response.' } } } },
    '/v1/auth/login': { post: { summary: 'Create a session', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } }, responses: { '200': { description: 'Session created.' }, '401': { description: 'Credentials are invalid or email is unverified.' } } } },
    '/v1/auth/logout': { post: { summary: 'Revoke the current session', responses: { '204': { description: 'Session revoked.' } } } },
    '/v1/auth/me': { get: { summary: 'Read the signed-in account', responses: { '200': { description: 'Current account.' }, '401': { description: 'Authentication required.' } } } },
    '/v1/auth/verify': { post: { summary: 'Verify an email address', responses: { '200': { description: 'Address verified.' }, '400': { description: 'Token is invalid or expired.' } } } },
    '/v1/auth/password-reset/request': { post: { summary: 'Request password reset', responses: { '202': { description: 'Generic reset response.' } } } },
    '/v1/auth/password-reset/complete': { post: { summary: 'Complete password reset', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PasswordReset' } } } }, responses: { '200': { description: 'Password reset and sessions revoked.' } } } },
  },
  components: { schemas: {
    Signup: schema(authSchemas.signup),
    Login: schema(authSchemas.login),
    PasswordReset: schema(authSchemas.reset),
    Problem: schema(problemSchema),
  } },
} as const;
