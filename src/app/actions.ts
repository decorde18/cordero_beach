'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addGuest(formData: FormData) {
  const name = formData.get('name') as string;
  const eta = formData.get('eta') as string;
  const party_size = parseInt(formData.get('party_size') as string) || 1;
  const main_dish = formData.get('main_dish') as string;
  const sides_apps = formData.get('sides_apps') as string;
  const drinks = formData.get('drinks') as string;
  const dessert = formData.get('dessert') as string;

  if (!name) return { error: 'Name is required.' };

  const { error } = await supabase
    .from('guests')
    .insert([{ 
      name, 
      eta, 
      party_size, 
      main_dish, 
      sides_apps, 
      drinks, 
      dessert 
    }]);

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
