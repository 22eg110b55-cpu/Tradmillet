"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-black/10">
        <div className="text-sm font-extrabold text-neutral-900">You’re subscribed!</div>
        <div className="mt-1 text-xs text-neutral-600">We’ll send you recipes and updates.</div>
      </div>
    );
  }

  return (
    <form
      className="mt-4 flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-brand-green"
      />
      <button type="submit" className="btn btn-primary sm:w-auto">
        Subscribe
      </button>
    </form>
  );
}


