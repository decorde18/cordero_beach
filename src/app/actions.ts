'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addGuest(formData: FormData) {
  const name = formData.get('name') as string;
  const bringing = formData.get('bringing') as string;
  const category = formData.get('category') as string;

  if (!name || !bringing || !category) return { error: 'Name, item, and category are required.' };

  const { error } = await supabase
    .from('guests')
    .insert([{ name, bringing, category }]);

  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true };
}

export async function updateSettings(formData: FormData) {
  const date = formData.get('date') as string;
  const active = formData.get('active') === 'on';
  const grilling = formData.get('grilling') as string;
  const beers_on_tap = formData.get('beers_on_tap') as string;

  const { error } = await supabase
    .from('party_settings')
    .update({
      date,
      active,
      grilling,
      beers_on_tap
    })
    .eq('id', 1);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
