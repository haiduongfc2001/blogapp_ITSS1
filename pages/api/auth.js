// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: 'Do Hai Duong' })
// }

import { supabaseClient } from "../../lib/client";

export default function handler(req, res) {
  supabaseClient.auth.api.setAuthCookie(req, res);
}