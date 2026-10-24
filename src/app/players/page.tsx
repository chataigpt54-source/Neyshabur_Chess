
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase';
import { Users, UserRound, ArrowLeft, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'بازیکنان و مربیان و داوران | هیأت شطرنج شهرستان نیشابور',
  description:
    'آشنایی با بازیکنان، مربیان و داوران هیأت شطرنج شهرستان نیشابور',
};

export const revalidate = 60;

async function getPlayers() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('خطا در دریافت فهرست افراد:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('خطا در دریافت فهرست افراد:', error);
    return [];
  }
}

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <main dir="rtl" className="min-h-screen bg-[#f3f6f9] text-[#0b2342]">
      {/* سربرگ صفحه */}
      <section className="relative isolate overflow-hidden bg-[#071a32] px-4 py-14 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 10% 20%, rgba(49,151,149,.22), transparent 42%), radial-gradient(ellipse at 90% 90%, rgba(237,198,111,.13), transparent 38%)',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-24 -z-10 h-64 w-64 rotate-45 rounded-[40px] border border-white/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-[18%] -z-10 h-64 w-64 rounded-full border border-[#edc66f]/15"
        />

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-[#edc66f] backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              خانواده شطرنج نیشابور
            </div>

            <h1 className="text-2xl font-black leading-relaxed sm:text-4xl">
              بازیکنان، مربیان و داوران
            </h1>

            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#edc66f] to-[#319795]" />

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
              با چهره‌های جامعه شطرنج شهرستان نیشابور آشنا شوید؛
              همراهان مسیر یادگیری، رقابت و پیشرفت.
            </p>

            <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edc66f]/15 text-[#edc66f]">
                <Users className="h-5 w-5" />
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-300">اعضای ثبت‌شده</p>
                <p className="mt-1 text-lg font-black text-white">
                  {players.length.toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-[#edc66f]/50 to-transparent"
        />
      </section>

      {/* فهرست افراد */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">
              چهره‌های شطرنج نیشابور
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              برای مشاهده اطلاعات هر فرد، کارت او را انتخاب کنید.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#319795]" />
            فهرست اعضا
          </div>
        </div>

        {players.length === 0 ? (
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#319795]/15 bg-[#319795]/10 text-[#319795]">
              <Users className="h-9 w-9" />
            </div>

            <h2 className="mt-6 text-lg font-black text-[#0b2342]">
              هنوز عضوی ثبت نشده است
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              پس از ثبت اطلاعات بازیکنان، مربیان و داوران، فهرست آن‌ها در این
              بخش نمایش داده می‌شود.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {players.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="person-card group relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_5px_22px_rgba(11,35,66,0.045)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#319795]/40 hover:shadow-[0_18px_42px_rgba(11,35,66,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#319795] focus-visible:ring-offset-4"
              >
                {/* نوار تزئینی بالای کارت */}
                <div className="relative h-24 overflow-hidden bg-gradient-to-br from-[#102b4b] via-[#0b2342] to-[#0b565d]">
                  <div
                    aria-hidden="true"
                    className="absolute -left-5 -top-10 h-32 w-32 rounded-full border border-white/10"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute -left-1 top-0 h-24 w-24 rounded-full border border-[#edc66f]/20"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-[#319795]/20 blur-2xl"
                  />

                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold text-slate-200 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#edc66f]" />
                    جامعه شطرنج
                  </span>
                </div>

                {/* تصویر فرد */}
                <div className="relative z-10 -mt-14 flex justify-center">
                  <div className="avatar-ring h-28 w-28 rounded-full p-[3px]">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-white bg-[#eaf0f5]">
                      {player.photo_url ? (
                        <Image
                          src={player.photo_url}
                          alt={`تصویر ${player.name}`}
                          fill
                          sizes="112px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e7f3f3] to-[#e9edf5] text-[#319795]">
                          <UserRound className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* اطلاعات فرد */}
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-center">
                  <h3 className="break-words text-base font-black leading-7 text-[#0b2342] transition-colors duration-300 group-hover:text-[#238784]">
                    {player.name}
                  </h3>

                  {player.bio ? (
                    <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-[1.8rem] text-slate-500">
                      {player.bio}
                    </p>
                  ) : (
                    <p className="mt-2 flex min-h-[66px] items-center justify-center text-xs text-slate-400">
                      اطلاعات بیشتری ثبت نشده است.
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-xs font-bold text-[#238784]">
                    <span>مشاهده پروفایل</span>
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </div>
                </div>

                {/* خط تزئینی پایین کارت */}
                <div className="h-1 w-full origin-right scale-x-0 bg-gradient-to-l from-[#edc66f] to-[#319795] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .person-card {
          animation: person-enter 0.5s ease both;
        }

        .person-card:nth-child(2) {
          animation-delay: 50ms;
        }

        .person-card:nth-child(3) {
          animation-delay: 100ms;
        }

        .person-card:nth-child(4) {
          animation-delay: 150ms;
        }

        .avatar-ring {
          background: linear-gradient(
            135deg,
            #edc66f 0%,
            #f8e7b5 25%,
            #319795 65%,
            #0b2342 100%
          );
          box-shadow: 0 5px 18px rgba(11, 35, 66, 0.15);
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .person-card:hover .avatar-ring {
          transform: translateY(-2px);
          box-shadow: 0 9px 24px rgba(49, 151, 149, 0.2);
        }

        @keyframes person-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .person-card {
            animation: none;
            transition: none;
          }

          .avatar-ring {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
