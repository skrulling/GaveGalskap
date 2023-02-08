import { supabase } from "~/supabase";

export async function getGifts() {
    let { data: gifts, error } = await supabase
  .from('gift')
  .select('*')

    console.log(gifts)
    return gifts;
}