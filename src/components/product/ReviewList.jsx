'use client';

import { useState } from 'react';
import { HiStar, HiOutlineStar } from 'react-icons/hi';

export default function ReviewList({ reviews = [], productId, onSubmitReview, isAuthenticated }) {
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitReview({ ...form, product: productId });
      setForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
        <div>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              i < Math.round(avgRating) ? <HiStar key={i} className="w-5 h-5 fill-current" /> : <HiOutlineStar key={i} className="w-5 h-5" />
            ))}
          </div>
          <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium">Write a Review</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}>
                {star <= form.rating ? <HiStar className="w-6 h-6 text-yellow-400 fill-current" /> : <HiOutlineStar className="w-6 h-6 text-gray-300" />}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Review title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
          <textarea placeholder="Your review" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" rows={3} />
          <button type="submit" disabled={submitting} className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{review.user?.name || 'Anonymous'}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  i < review.rating ? <HiStar key={i} className="w-3.5 h-3.5 fill-current" /> : <HiOutlineStar key={i} className="w-3.5 h-3.5" />
                ))}
              </div>
            </div>
            {review.title && <h5 className="font-medium text-sm mt-1">{review.title}</h5>}
            <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
