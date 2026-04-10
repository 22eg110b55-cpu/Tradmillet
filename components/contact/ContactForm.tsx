"use client";

export function ContactForm() {
  return (
    <form
      className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur lg:col-span-2"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Thanks! We received your message. (Demo form)");
      }}
    >
      <div className="text-lg font-extrabold text-neutral-900">Send us a message</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" placeholder="Name" required />
        <input className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10" placeholder="Phone" required />
        <input
          className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10 sm:col-span-2"
          placeholder="Email"
          type="email"
          required
        />
        <textarea
          className="min-h-32 rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10 sm:col-span-2"
          placeholder="How can we help?"
          required
        />
      </div>
      <button className="btn btn-primary mt-5 w-full">Submit</button>
    </form>
  );
}


