'use client';

import { useEffect, useMemo } from 'react';

type Props = {
  tournamentId: string;
  tournamentTitle: string;
};

/** شناسه فرم Tally */
const TALLY_FORM_ID = 'Zjpy2z';

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

export default function RegistrationForm({
  tournamentId,
  tournamentTitle,
}: Props) {
  const embedSrc = useMemo(() => {
    const params = new URLSearchParams({
      alignLeft: '1',
      hideTitle: '1',
      transparentBackground: '1',
      dynamicHeight: '1',
      tournament_id: tournamentId,
      tournament_title: tournamentTitle,
    });

    return 'https://tally.so/embed/' + TALLY_FORM_ID + '?' + params.toString();
  }, [tournamentId, tournamentTitle]);

  useEffect(() => {
    const src = 'https://tally.so/widgets/embed.js';

    const load = () => {
      if (typeof window.Tally !== 'undefined') {
        window.Tally.loadEmbeds();
        return;
      }
      document
        .querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]:not([src])')
        .forEach((el) => {
          el.src = el.dataset.tallySrc || '';
        });
    };

    if (document.querySelector(`script[src="${src}"]`)) {
      load();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = load;
    script.onerror = load;
    document.body.appendChild(script);
  }, [embedSrc]);

  return (
    <div className="w-full" dir="rtl">
      <p className="text-sm text-slate-500 mb-4">
        ثبت‌نام برای:{' '}
        <span className="font-bold text-navy-800">{tournamentTitle}</span>
      </p>

      <iframe
        data-tally-src={embedSrc}
        loading="lazy"
        width="100%"
        height="520"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title={'ثبت‌نام ' + tournamentTitle}
        className="w-full rounded-xl border-0 min-h-[520px]"
      />
    </div>
  );
}
