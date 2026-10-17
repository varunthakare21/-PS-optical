import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: string; type: ToastType; message: string; }
interface ToastContextType { showToast: (msg: string, type?: ToastType, ms?: number) => void; }

const ToastContext = createContext<ToastContextType | null>(null);
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside <Toaster>');
  return ctx;
};

const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
const palette = {
  success: { bg: '#1C2E1A', border: '#2E4A2B', icon: '#5BB450' },
  error:   { bg: '#2A1714', border: '#4A2018', icon: '#B65E43' },
  warning: { bg: '#2C2719', border: '#4A3C22', icon: '#D4B483' },
  info:    { bg: '#1A2220', border: '#2A3535', icon: '#72785A' },
};

export function Toaster({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', ms = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), ms);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.625rem', maxWidth: '360px', width: 'calc(100vw - 3rem)' }}>
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            const c = palette[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                style={{
                  background: c.bg, border: `1px solid ${c.border}`,
                  borderRadius: '10px', padding: '0.875rem 1rem',
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#F0EAE0',
                }}
              >
                <Icon size={18} style={{ color: c.icon, flexShrink: 0, marginTop: '1px' }} />
                <span style={{ flex: 1, lineHeight: 1.5 }}>{t.message}</span>
                <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#72685A', padding: 0, flexShrink: 0, marginTop: '1px' }}
                  aria-label="Dismiss"
                >
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
