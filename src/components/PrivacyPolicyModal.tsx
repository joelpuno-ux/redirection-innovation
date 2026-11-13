import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type PrivacyPolicyModalProps = {
  onClose: () => void;
};

export function PrivacyPolicyModal({ onClose }: PrivacyPolicyModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-corporate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-corporate-100 px-6 sm:px-10 py-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="privacy-policy-title" className="text-xl sm:text-2xl font-bold text-corporate-900 leading-tight">
              Privacy Policy para sa Redirection Innovation at Kabyaw Eats
            </h2>
            <p className="text-xs text-corporate-500 mt-1">Huling binago: Nobyembre 14, 2026</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Isara ang Privacy Policy"
            className="shrink-0 w-10 h-10 rounded-xl bg-corporate-50 text-corporate-600 hover:bg-redirection-600 hover:text-white transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-10 py-8 space-y-6 text-sm sm:text-base text-corporate-700 leading-relaxed">
          <p>
            Iginagalang at pinoprotektahan ng Redirection Innovation Inc. ("kami", "aming kumpanya")
            ang iyong privacy. Ipapaliwanag ng Privacy Policy na ito kung paano namin kinokolekta,
            ginagamit, at pinoprotektahan ang iyong impormasyon kapag ginagamit mo ang aming website
            (redirectioninnovation.com) at ang aming mobile application na Kabyaw Eats.
          </p>
          <p>
            Sa paggamit ng aming mga serbisyo, sumasang-ayon ka sa pangongolekta at paggamit ng
            impormasyon alinsunod sa patakarang ito.
          </p>

          <section>
            <h3 className="text-lg font-bold text-corporate-900 mb-3">1. Impormasyong Kinokolekta Namin</h3>
            <p className="mb-3">
              Maaari kaming mangolekta ng mga sumusunod na uri ng impormasyon para sa pagpapaganda ng
              aming mga serbisyo (tulad ng paghahatid ng pagkain at serbisyo sa negosyo):
            </p>
            <ul className="space-y-3 list-none">
              <li className="pl-4 border-l-2 border-redirection-300">
                <span className="font-semibold text-corporate-900">Personal Data:</span> Pangalan, email
                address, contact number (tulad ng aming Partner Hotline), at tirahan (Head Office: Purok
                4, San Carlos, Cabiao, Nueva Ecija) kapag nakikipag-ugnayan ka sa amin o nagrerehistro
                bilang kasosyo, merchant, o rider.
              </li>
              <li className="pl-4 border-l-2 border-redirection-300">
                <span className="font-semibold text-corporate-900">Device &amp; Usage Data:</span>
                Impormasyon tungkol sa ginagamit mong mobile device o browser, IP address, at kung
                paano mo ginagamit ang aming app o website.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-corporate-900 mb-3">2. Paano Namin Ginagamit ang Iyong Impormasyon</h3>
            <p className="mb-3">Ang mga nakolektang datos ay ginagamit para sa mga sumusunod na layunin:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Upang maibigay at mapanatili ang aming mga serbisyo sa Kabyaw Eats at Redirection Innovation.</li>
              <li>Upang iproseso ang mga transaksyon, paghahatid, o komunikasyon sa pagitan ng mga merchant, rider, at mga kliyente.</li>
              <li>Upang magpadala ng mga update, abiso, o tugon sa mga katanungan sa pamamagitan ng aming suporta.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-corporate-900 mb-3">3. Pagbabahagi ng Impormasyon</h3>
            <p className="mb-3">
              Hindi namin ibinebentang personal ang iyong impormasyon sa iba. Maaari lamang naming
              ibahagi ito sa mga sumusunod na sitwasyon:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Sa mga awtorisadong kasosyo sa paghahatid (mga rider) at merchant para maisagawa ang transaksyon sa Kabyaw Eats.</li>
              <li>Kung kinakailangan ng batas o ng mga regulasyon ng pamahalaan (tulad ng SEC o BIR sa Pilipinas).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-corporate-900 mb-3">4. Seguridad ng Datos</h3>
            <p>
              Ginagamit namin ang angkop na teknikal at pang-organisasyong hakbang sa seguridad
              (kabilang ang secure hosting at encrypted connections) upang protektahan ang iyong
              personal na impormasyon laban sa hindi awtorisadong pag-access o pagkawala.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-corporate-900 mb-3">5. Makipag-ugnayan sa Amin</h3>
            <p className="mb-3">
              Kung mayroon kang mga katanungan tungkol sa Privacy Policy na ito, maaari kang
              makipag-ugnayan sa amin sa:
            </p>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-corporate-900">Head Office:</span> Purok 4, San
                Carlos, Cabiao, Nueva Ecija, Philippines
              </li>
              <li>
                <span className="font-semibold text-corporate-900">Partner Hotline:</span>{' '}
                <a href="tel:09613497061" className="text-redirection-600 hover:text-redirection-700 font-medium underline underline-offset-2">
                  09613497061
                </a>
              </li>
              <li>
                <span className="font-semibold text-corporate-900">Email:</span>{' '}
                <a href="mailto:support@redirectioninnovation.com" className="text-redirection-600 hover:text-redirection-700 font-medium underline underline-offset-2">
                  support@redirectioninnovation.com
                </a>
              </li>
            </ul>
          </section>

          <div className="pt-4 border-t border-corporate-100">
            <button type="button" onClick={onClose} className="btn-primary w-full sm:w-auto text-center">
              Isara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}