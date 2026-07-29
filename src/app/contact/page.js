'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In production, send to your API
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">Have a question? We&apos;d love to hear from you.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-1">Address</h3>
          <p className="text-sm text-gray-500">123 Main Boulevard, Gulberg, Lahore, Pakistan</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-1">Phone</h3>
          <p className="text-sm text-gray-500">+92 300 1234567</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-sm text-gray-500">info@laptopstore.pk</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-1">Business Hours</h3>
          <p className="text-sm text-gray-500">Mon-Sat: 10:00 AM - 7:00 PM</p>
        </div>
      </div>

      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700 font-medium">Thank you! Your message has been sent.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700">Send Message</button>
        </form>
      )}
    </div>
  );
}
