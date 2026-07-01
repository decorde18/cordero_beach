import { getSupabaseClient } from '@/lib/supabase';
import AddGuestForm from '@/components/AddGuestForm';
import MenuSummaryPopup from '@/components/MenuSummaryPopup';
import { Calendar, CheckCircle2, Flame, Beer, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 0;

export default async function Home() {
  const client = getSupabaseClient();

  if (!client) {
    return (
      <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
        <div className="glass-panel rounded-3xl p-6">
          <h1 className="text-2xl font-bold">Pool Party Time</h1>
          <p className="mt-3 text-sm opacity-80">
            Supabase is not configured yet. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY values to load the RSVP app.
          </p>
        </div>
      </main>
    );
  }

  // Fetch the latest available event settings so the app can work with more than one event.
  const { data: settingsData, error: settingsError } = await client
    .from('party_settings')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    console.error('Supabase settings fetch error:', settingsError.message);
  }

  // Fetch guests
  const { data: guestsData, error: guestsError } = await client
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (guestsError) {
    console.error('Supabase guests fetch error:', guestsError.message);
  }

  const settings = settingsData || {
    date: null,
    active: false,
    grilling: '',
    beers_on_tap: '',
    event_name: 'Event 1'
  };

  const guests = (guestsData || []).filter((guest: any) => {
    if (guest.event_id == null) return true;
    return Number(guest.event_id) === Number(settings.id ?? 1);
  });

  const totalGuests = guests.reduce((sum: number, g: any) => sum + (g.party_size || 1), 0);

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Compact Header & Settings Bar */}
      <header className="flex flex-col lg:flex-row gap-4 items-center justify-between glass-panel rounded-3xl p-4 md:p-6">
        <div className="flex items-center gap-4">
          <img src="/CBEACH-coin.png" alt="CBEACH Logo" className="w-16 h-16 object-contain drop-shadow-lg" />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Pool Party Time
            </h1>
            <p className="text-sm opacity-80 mt-1">
              RSVP and let us know what you're bringing for {settings.event_name || 'this event'}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
          <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium">{settings.date ? format(new Date(settings.date), 'MMM do @ h:mm a') : 'TBD'}</span>
          </div>
          <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
            <CheckCircle2 className={`w-4 h-4 ${settings.active ? 'text-green-500' : 'text-red-500'}`} />
            <span className="font-medium">{settings.active ? 'ON' : 'TBD'}</span>
          </div>
          {settings.grilling && (
            <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{settings.grilling}</span>
            </div>
          )}
          {settings.beers_on_tap && (
            <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
              <Beer className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{settings.beers_on_tap}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Section (Smaller width) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-3xl p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-4">RSVP Here</h3>
            <AddGuestForm eventId={Number(settings.id ?? 1)} />
          </div>
        </div>

        {/* Guest List Cards (Larger width) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Who's Coming ({totalGuests} people)
              </h3>
              <MenuSummaryPopup guests={guests} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {guests.length === 0 ? (
                <p className="opacity-70 italic col-span-full py-8">No one has RSVP'd yet. Be the first!</p>
              ) : (
                guests.map((guest: any) => (
                  <div key={guest.id} className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg leading-tight">
                          {guest.name}
                          {guest.party_size > 1 && <span className="text-sm font-normal opacity-70 ml-1">(+{guest.party_size - 1})</span>}
                        </h4>
                        {guest.eta && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            ETA: {guest.eta}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 text-sm">
                      {guest.main_dish && (
                        <div className="flex items-start gap-2">
                          <span className="text-orange-500">🍔</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Main</span>
                            {guest.main_dish}
                          </div>
                        </div>
                      )}
                      {guest.sides_apps && (
                        <div className="flex items-start gap-2">
                          <span className="text-green-500">🥗</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Sides/Apps</span>
                            {guest.sides_apps}
                          </div>
                        </div>
                      )}
                      {guest.drinks && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500">🥤</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Drinks</span>
                            {guest.drinks}
                          </div>
                        </div>
                      )}
                      {guest.dessert && (
                        <div className="flex items-start gap-2">
                          <span className="text-pink-500">🧁</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Dessert</span>
                            {guest.dessert}
                          </div>
                        </div>
                      )}
                      {guest.other_items && (
                        <div className="flex items-start gap-2">
                          <span className="text-purple-500">🧊</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Other/Supplies</span>
                            {guest.other_items}
                          </div>
                        </div>
                      )}
                      {!guest.main_dish && !guest.sides_apps && !guest.drinks && !guest.dessert && !guest.other_items && (
                        <div className="text-xs opacity-50 italic">Just bringing the good vibes!</div>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
