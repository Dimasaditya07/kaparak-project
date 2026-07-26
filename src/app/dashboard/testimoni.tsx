/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserIcon } from "@/components/icons/UserIcon";
import { getReviews } from "@/lib/query/reviews";
import { Review } from "@/lib/query/review.model";

export default function Testimoni() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-24 px-10 bg-black text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-green-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-sans text-[10px] uppercase tracking-[0.5em] text-green-500 mb-4"
          >
            Voices of Explorers
          </motion.p>

          <h2 className="font-sans text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
            Apa Kata{" "}
            <span className="text-green-500 stroke-text-thin">
              Customer Kami?
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">
            Memuat testimoni...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400">
            Belum ada testimoni.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative p-8 border border-white/10 bg-white/5 backdrop-blur-md hover:border-green-500/30 transition-all duration-500 group rounded-xl"
              >
                <div className="text-green-500 mb-6 opacity-60 group-hover:opacity-100">
                  <svg
                    width="30"
                    height="24"
                    viewBox="0 0 30 24"
                    fill="currentColor"
                  >
                    <path d="M0 24V11.31C0 4.65 3.93 0 10.65 0V4.41C7.17 4.41 5.34 6.66 5.34 9.39H10.65V24H0ZM19.35 24V11.31C19.35 4.65 23.28 0 30 0V4.41C26.52 4.41 24.69 6.66 24.69 9.39H30V24H19.35Z" />
                  </svg>
                </div>

                <p className="text-sm leading-relaxed text-gray-300 italic mb-8 min-h-[120px]">
                  "{review.review}"
                </p>

                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-green-500/20">
                    <UserIcon className="w-5 h-5 text-green-500" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {review.user?.name ?? "Customer"}
                    </h4>

                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      Customer Kaparak
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}