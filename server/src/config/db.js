const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ SUPABASE_URL atau SUPABASE_KEY belum ter-set di server/.env"
  );
}

// Debug kecil, tapi JANGAN print full key
console.log("🔧 SUPABASE_URL:", supabaseUrl);
console.log(
  "🔧 SUPABASE_KEY ada?:",
  supabaseKey ? `ya (panjang=${supabaseKey.length})` : "tidak"
);

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
