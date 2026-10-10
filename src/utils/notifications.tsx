import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type NoticeType = 'success' | 'error';
type Notice = { id: number; message: string; type: NoticeType };

const noticeEvent = 'pulangkesinii:notice';

export const notify = (message: string, type: NoticeType = 'success') => {
  window.dispatchEvent(new CustomEvent(noticeEvent, { detail: { message, type } }));
};

export const NoticeViewport: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const addNotice = (event: Event) => {
      const detail = (event as CustomEvent<Omit<Notice, 'id'>>).detail;
      if (!detail?.message) return;
      const id = Date.now() + Math.random();
      setNotices((current) => [...current, { id, message: detail.message, type: detail.type || 'success' }]);
      window.setTimeout(() => setNotices((current) => current.filter((notice) => notice.id !== id)), 5000);
    };
    window.addEventListener(noticeEvent, addNotice);
    return () => window.removeEventListener(noticeEvent, addNotice);
  }, []);

  return (
    <div className="fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 pointer-events-none" aria-live="polite">
      {notices.map((notice) => {
        const isError = notice.type === 'error';
        return (
          <div key={notice.id} className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-3.5 shadow-xl ${isError ? 'bg-[#FFF5F4] border-[#FFCCC7] text-[#9F1D16]' : 'bg-[#F0FBF8] border-[#B7E8DC] text-[#087C6E]'}`}>
            {isError ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="flex-1 text-xs font-semibold leading-relaxed">{notice.message}</p>
            <button type="button" onClick={() => setNotices((current) => current.filter((item) => item.id !== notice.id))} className="-m-1 rounded-lg p-1 opacity-70 hover:opacity-100 cursor-pointer" aria-label="Tutup notifikasi"><X className="w-4 h-4" /></button>
          </div>
        );
      })}
    </div>
  );
};
