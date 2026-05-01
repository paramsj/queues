import { supabase } from "./supabase.js";

const checkDB = async() =>{
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    console.log('Supabase connected');
};

export {checkDB};