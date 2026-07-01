import { getSupabaseClient } from '@/lib/supabase';
import { createEvent, updateSettings } from '@/app/actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Plus, Settings } from 'lucide-react';

type PartySettingsRow = {
  id: number;
  date?: string | null;
  active?: boolean | null;
  grilling?: string | null;
  beers_on_tap?: string | null;
  event_name?: string | null;
};

export const revalidate = 0;

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ event?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedEventId = Number(resolvedSearchParams.event ?? '1');

  const client = getSupabaseClient();

  if (!client) {
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <h1 className="text-2xl font-bold">Party Admin</h1>
          <p className="mt-3 text-sm opacity-80">
            Supabase is not configured yet. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY values to continue.
          </p>
        </div>
      </main>
    );
  }

  const { data: eventsData, error: eventsError } = await client
    .from('party_settings')
    .select('*')
    .order('id', { ascending: true });

  if (eventsError) {
    console.error('Supabase event fetch error:', eventsError.message);
  }

  const events = (eventsData || []) as PartySettingsRow[];
  const latestEventId = events.length > 0 ? Number(events[events.length - 1].id) : 1;
  const selectedId =
    events.find((event) => Number(event.id) === requestedEventId)?.id ??
    latestEventId ??
    1;
  const selectedEvent =
    events.find((event) => Number(event.id) === selectedId) || {
      id: selectedId,
      date: null,
      active: false,
      grilling: '',
      beers_on_tap: '',
      event_name: `Event ${selectedId}`,
    };

  const dateObj = selectedEvent.date ? new Date(selectedEvent.date) : new Date();
  const dateStr = dateObj.toISOString().slice(0, 16);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/" className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Party Admin
        </h1>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">Manage an event</p>
            <h2 className="text-xl font-semibold">{selectedEvent.event_name || `Event ${selectedEvent.id}`}</h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <form action="/admin" method="get" className="flex items-center gap-2">
              <select
                name="event"
                defaultValue={String(selectedEvent.id)}
                className="rounded-xl border border-border bg-background/50 px-3 py-2 text-sm"
              >
                {events.length === 0 ? (
                  <option value="1">Default event</option>
                ) : (
                  events.map((event) => (
                    <option key={event.id} value={String(event.id)}>
                      {event.event_name || `Event ${event.id}`}
                    </option>
                  ))
                )}
              </select>
              <button
                type="submit"
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                Open
              </button>
            </form>

            <form action={async () => {
              'use server';
              const result = await createEvent();
              if (result?.success && result.id) {
                const redirectUrl = `/admin?event=${result.id}`;
                return redirect(redirectUrl);
              }
            }}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </form>
          </div>
        </div>

        <form
          action={async (formData) => {
            'use server';
            await updateSettings(formData);
          }}
          className="space-y-6"
        >
          <input type="hidden" name="event_id" value={selectedEvent.id} />

          <div>
            <label htmlFor="event_name" className="block text-sm font-medium mb-1 opacity-80">
              Event Name
            </label>
            <input
              type="text"
              id="event_name"
              name="event_name"
              defaultValue={selectedEvent.event_name || ''}
              placeholder="e.g. Summer Pool Party"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1 opacity-80">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              defaultValue={dateStr}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="active"
              name="active"
              defaultChecked={Boolean(selectedEvent.active)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="active" className="text-sm font-medium opacity-80 cursor-pointer">
              Event is Active / ON
            </label>
          </div>

          <div>
            <label htmlFor="grilling" className="block text-sm font-medium mb-1 opacity-80">
              What's Grilling?
            </label>
            <input
              type="text"
              id="grilling"
              name="grilling"
              defaultValue={selectedEvent.grilling || ''}
              placeholder="e.g. Brisket, Ribs, Burgers"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label htmlFor="beers_on_tap" className="block text-sm font-medium mb-1 opacity-80">
              Beers on Tap
            </label>
            <input
              type="text"
              id="beers_on_tap"
              name="beers_on_tap"
              defaultValue={selectedEvent.beers_on_tap || ''}
              placeholder="e.g. Modelos and Coronas"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            Save Event Settings
          </button>
        </form>
      </div>

      <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-4 rounded-xl border border-yellow-500/20 text-sm">
        <p className="font-bold mb-1">Database Notes:</p>
        <p>The admin page now works with multiple rows in the party_settings table. Each row is treated as one event.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><code>party_settings</code> (id: int8, date: timestampz, active: bool, grilling: text, beers_on_tap: text)</li>
          <li><code>guests</code> (id: uuid, name: text, bringing: text, created_at: timestampz)</li>
        </ul>
      </div>
    </main>
  );
}
