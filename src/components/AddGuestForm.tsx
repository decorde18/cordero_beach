"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { addGuest } from "@/app/actions";

export default function AddGuestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setError(null);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await addGuest(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        formRef.current?.reset();
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      onSubmit={handleFormSubmit}
      className='space-y-4'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='md:col-span-2'>
          <label
            htmlFor='name'
            className='block text-sm font-medium mb-1 opacity-80'
          >
            Your Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            required
            placeholder='e.g. Maverick'
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>

        <div>
          <label
            htmlFor='party_size'
            className='block text-sm font-medium mb-1 opacity-80'
          >
            Total People
          </label>
          <input
            type='number'
            id='party_size'
            name='party_size'
            min='1'
            defaultValue='1'
            required
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>

        <div>
          <label
            htmlFor='eta'
            className='block text-sm font-medium mb-1 opacity-80'
          >
            ETA (Approx)
          </label>
          <input
            type='text'
            id='eta'
            name='eta'
            placeholder='e.g. 2:00 PM'
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>
      </div>

      <div className='pt-2 border-t border-white/10 space-y-3'>
        <h4 className='text-sm font-bold uppercase text-primary tracking-wider'>
          What are you bringing? (Optional)
        </h4>

        <div>
          <label
            htmlFor='main_dish'
            className='block text-xs font-medium mb-1 opacity-80'
          >
            Main Dish
          </label>
          <input
            type='text'
            id='main_dish'
            name='main_dish'
            placeholder='e.g. Brisket, Veggie Burgers'
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>

        <div>
          <label
            htmlFor='sides_apps'
            className='block text-xs font-medium mb-1 opacity-80'
          >
            Sides / Apps
          </label>
          <input
            type='text'
            id='sides_apps'
            name='sides_apps'
            placeholder='e.g. Chips & Guac, Salad'
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>

        <div>
          <label
            htmlFor='drinks'
            className='block text-xs font-medium mb-1 opacity-80'
          >
            Drinks
          </label>
          <input
            type='text'
            id='drinks'
            name='drinks'
            placeholder='e.g. 12-pack Modelo, Sprite'
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>

        <div>
          <label
            htmlFor='dessert'
            className='block text-xs font-medium mb-1 opacity-80'
          >
            Dessert
          </label>
          <input
            type='text'
            id='dessert'
            name='dessert'
            placeholder='e.g. Brownies, Watermelon'
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>

        <div>
          <label
            htmlFor='other_items'
            className='block text-xs font-medium mb-1 opacity-80'
          >
            Other / Supplies
          </label>
          <input
            type='text'
            id='other_items'
            name='other_items'
            placeholder='e.g. Ice, Cups, Sunscreen'
            className='w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all'
          />
        </div>

        <div className='mt-4 bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm'>
          <p className='font-bold text-primary mb-1'>💡 Always Accepted:</p>
          <p className='opacity-80'>
            Ice, soft drink cans, Beer, Margarita/ Piña Colada Mix,Tequila,
            Rum{" "}
          </p>
        </div>
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <button
        type='submit'
        disabled={loading}
        className='w-full py-3 mt-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center'
      >
        {loading ? (
          <span className='animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full'></span>
        ) : (
          "Add Me to the List"
        )}
      </button>
    </form>
  );
}
