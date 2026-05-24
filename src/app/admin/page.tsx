import { supabase } from '@/lib/supabase';
import { updateSettings } from '@/app/actions';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';

export const revalidate = 0;

export default async function AdminPage() {
  const { data: settingsData } = await supabase
    .from('party_settings')
    .select('*')
    .eq('id', 1)
    .single();

  const settings = settingsData || {
    date: new Date().toISOString(),
    active: true,
    grilling: '',
    beers_on_tap: ''
  };

  // Convert to local datetime-local format string
  const dateObj = settings.date ? new Date(settings.date) : new Date();
  const dateStr = dateObj.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm

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

      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <form action={updateSettings} className="space-y-6">
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1 opacity-80">
              Party Date & Time
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
              defaultChecked={settings.active}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="active" className="text-sm font-medium opacity-80 cursor-pointer">
              Party is Active / ON
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
              defaultValue={settings.grilling}
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
              defaultValue={settings.beers_on_tap}
              placeholder="e.g. Modelos and Coronas"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            Save Settings
          </button>
        </form>
      </div>

      <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-4 rounded-xl border border-yellow-500/20 text-sm">
        <p className="font-bold mb-1">Database Instructions:</p>
        <p>Make sure you have created the following tables in Supabase:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><code>party_settings</code> (id: int8, date: timestampz, active: bool, grilling: text, beers_on_tap: text) - Add one row with id 1.</li>
          <li><code>guests</code> (id: uuid, name: text, bringing: text, created_at: timestampz)</li>
        </ul>
      </div>

    </main>
  );
}
