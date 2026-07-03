'use server'

import { getSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addGuest(formData: FormData) {
  const name = formData.get('name') as string;
  const eta = formData.get('eta') as string;
  const party_size = parseInt(formData.get('party_size') as string) || 1;
  const main_dish = formData.get('main_dish') as string;
  const sides_apps = formData.get('sides_apps') as string;
  const drinks = formData.get('drinks') as string;
  const dessert = formData.get('dessert') as string;
  const other_items = formData.get('other_items') as string;
  const eventId = Number(formData.get('event_id') as string) || 1;

  if (!name) return { error: 'Name is required.' };

  const client = getSupabaseClient();
  if (!client) {
    return { error: 'Supabase is not configured. Add your URL and anon key to the environment.' };
  }

  const { error } = await client.from('guests').insert([{
    name,
    eta,
    party_size,
    main_dish,
    sides_apps,
    drinks,
    dessert,
    other_items,
    event_id: eventId,
  }]);

  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true };
}

export async function createEvent() {
  const client = getSupabaseClient();
  if (!client) {
    return { error: 'Supabase is not configured. Add your URL and anon key to the environment.' };
  }

  const { data: existingEvents, error: listError } = await client
    .from('party_settings')
    .select('id')
    .order('id', { ascending: true });

  if (listError) return { error: listError.message };

  const existingIds = (existingEvents || []).map((row: { id?: number | string }) => Number(row.id || 0));
  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

  const { error } = await client.from('party_settings').insert([
    {
      id: nextId,
      date: null,
      active: false,
      grilling: '',
      beers_on_tap: '',
      event_name: `Event ${nextId}`,
    },
  ]);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, id: nextId };
}

export async function updateSettings(formData: FormData) {
  const date = formData.get('date') as string;
  const active = formData.get('active') === 'on';
  const grilling = formData.get('grilling') as string;
  const beers_on_tap = formData.get('beers_on_tap') as string;
  const eventName = (formData.get('event_name') as string || '').trim();
  const eventId = Number(formData.get('event_id') as string) || 1;

  const client = getSupabaseClient();
  if (!client) {
    return { error: 'Supabase is not configured. Add your URL and anon key to the environment.' };
  }

  const { error } = await client
    .from('party_settings')
    .update({
      date,
      active,
      grilling,
      beers_on_tap,
      event_name: eventName || `Event ${eventId}`,
    })
    .eq('id', eventId);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
