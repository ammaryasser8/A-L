import { createApp } from '../server/src/app.js';

// Vercel invokes this catch-all Express function for every /api/* request.
// Local development continues to use server/src/index.js, which owns listen().
export default createApp();
