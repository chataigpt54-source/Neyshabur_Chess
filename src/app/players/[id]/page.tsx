import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  ArrowRight,
  UserRound,
  Award,
  Sparkles,
  Trophy,
  Quote,
} from 'lucide-react';

export const revalidate = 60;

async function getPlayer(id: string) {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;

    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const player = await getPlayer(params.id);

  return {
    title: player
      ? `${player.name} | هیأت شطرنج شهرستان نیشابور`
      : 'مشخصات بازیکن | هیأت شطرنج شهرستان نیشابور',
    description: player?.bio || 'مشخصات و افتخارات اعضای خانواده شطرنج نیشابور',
  };
}

export default async function PlayerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const player = await getPlayer(params.id);

  if (!player) notFound();

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f3f6f9] px-4 py-8 md:py-14"
    >
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb / Back */}
        <Link
          href="/players"
          className="group mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#0b2342] shadow-sm transition hover:border-teal-200 hover:bg-white"
        >
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          بازگشت به خانواده شطرنج نیشابور
        </Link>

        {/* Main profile card */}
        <article className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_20px_70px_rgba(10,18,32,0.09)]">
          {/* Hero */}
          <div className="relative isolate overflow-hidden bg-gradient-to-l from-[#071a32] via-[#0b2342] to-[#176b70] px-6 pb-24 pt-10 md:px-12 md:pb-28 md:pt-14">
            <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -left-4 -top-8 h-40 w-40 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />

            <div className="relative flex items-center gap-2 text-sm font-medium text-white/70">
              <Sparkles className="h-4 w-4 text-[#edc66f]" />
              <span>خانواده شطرنج شهرستان نیشابور</span>
            </div>

            <div className="relative mt-5 max-w-2xl">
              <p className="text-xs font-bold tracking-widest text-[#edc66f]">
                PLAYER PROFILE
              </p>
              <h1 className="mt-3 text-3xl font-black leading-relaxed text-white md:text-5xl">
                {player.name}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 md:text-base">
                آشنایی با مسیر، زندگی ورزشی و افتخارات اعضای خانواده شطرنج
                نیشابور
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-[#edc66f] via-[#319795] to-transparent" />
          </div>

          {/* Profile content */}
          <div className="relative px-5 pb-8 md:px-12 md:pb-12">
            <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="relative h-32 w-32 shrink-0 rounded-[2rem] border-[5px] border-white bg-white shadow-[0_12px_35px_rgba(7,26,50,0.18)] md:h-40 md:w-40">
                <div className="h-full w-full overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-[#e7f5f4] to-[#f3f6f9]">
                  {player.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={player.photo_url}
                      alt={`تصویر ${player.name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound className="h-16 w-16 text-[#319795] md:h-20 md:w-20" />
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-2 -left-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-white bg-[#edc66f] text-[#071a32]">
                  <Trophy className="h-4 w-4" />
                </span>
              </div>

              <div className="pb-1 sm:pb-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-bold text-[#176b70]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#319795]" />
                  عضو خانواده شطرنج نیشابور
                </span>
                <h2 className="mt-3 text-xl font-extrabold text-[#0b2342] md:text-2xl">
                  {player.name}
                </h2>
              </div>
            </div>

            {/* Bio */}
            {player.bio && (
              <section className="mt-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-[#319795]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0b2342]">
                      درباره ایشان
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      زندگی و مسیر شطرنجی
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-5 text-sm leading-8 text-slate-600 md:p-7 md:text-base">
                  <Quote className="mb-2 h-5 w-5 text-[#319795]/70" />
                  <p className="whitespace-pre-wrap">{player.bio}</p>
                </div>
              </section>
            )}

            {/* Achievements */}
            {player.achievements && (
              <section className="mt-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-[#b88619]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0b2342]">
                      مقام‌ها و افتخارات
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      دستاوردهای ورزشی
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-gradient-to-bl from-amber-50/80 to-white p-5 text-sm leading-8 text-slate-700 md:p-7 md:text-base">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#edc66f]/25 text-[#9a6b0b]">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <p className="whitespace-pre-wrap">
                    {player.achievements}
                  </p>
                </div>
              </section>
            )}

            {/* Empty state */}
            {!player.bio && !player.achievements && (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <Sparkles className="mx-auto h-7 w-7 text-[#319795]" />
                <p className="mt-3 font-semibold text-[#0b2342]">
                  اطلاعات این پروفایل به‌زودی تکمیل می‌شود.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  برای مشاهده سایر اعضا می‌توانید به فهرست بازیکنان بازگردید.
                </p>
              </div>
            )}

            {/* Back button */}
            <div className="mt-10 border-t border-slate-100 pt-6">
              <Link
                href="/players"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b2342] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#0b2342]/10 transition hover:-translate-y-0.5 hover:bg-[#12365d] sm:w-auto"
              >
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                مشاهده همه بازیکنان
              </Link>
            </div>
          </div>
        </article>

        <p className="mt-6 text-center text-xs text-slate-400">
          هیأت شطرنج شهرستان نیشابور
        </p>
      </div>
    </main>
  );
}
