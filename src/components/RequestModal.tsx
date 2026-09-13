import { animated, useTransition } from '@react-spring/web';
import { useState, type FormEvent } from 'react';
import { LogoMark, XMark } from './icons';
import { PillButton } from './ui/PillButton';
import { SPRING } from '../lib/constants';
import { DEFAULT_REQUEST_COPY, type RequestModalCopy } from '../lib/requestCopy';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useUI } from '../context/ui-context';

type Status = 'idle' | 'submitting' | 'sent';

export function RequestModal({ copy = DEFAULT_REQUEST_COPY }: { copy?: RequestModalCopy } = {}) {
  const { modalOpen, closeModal } = useUI();

  useEscapeKey(modalOpen, closeModal);

  const transitions = useTransition(modalOpen, {
    from: { opacity: 0, y: 28 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 18 },
    config: SPRING.modal,
  });

  return transitions((style, open) =>
    open ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Start a project"
        data-testid="request-modal"
        onClick={closeModal}
        className="fixed inset-0 z-[110] flex items-end justify-center bg-foreground/30 p-4 backdrop-blur-xl sm:items-center"
      >
        <animated.div
          style={style}
          onClick={(event) => event.stopPropagation()}
          className="relative w-full max-w-lg overflow-hidden rounded-card bg-background p-6 shadow-2xl ring-1 ring-line sm:p-8"
        >
          <button
            onClick={closeModal}
            aria-label="Close dialog"
            className="absolute top-4 right-4 grid size-9 place-items-center rounded-pill bg-surface text-sm text-foreground/60 hover:bg-surface-2 hover:text-foreground"
          >
            <XMark />
          </button>
          <ModalBody copy={copy} onDone={closeModal} />
        </animated.div>
      </div>
    ) : null,
  );
}

function ModalBody({ copy, onDone }: { copy: RequestModalCopy; onDone: () => void }) {
  const [status, setStatus] = useState<Status>('idle');

  // Submission is intentionally a stub — there is no backend behind this form.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    window.setTimeout(() => setStatus('sent'), 600);
  };

  if (status === 'sent') {
    return (
      <div
        data-testid="request-success"
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div className="grid size-14 place-items-center rounded-pill bg-ink text-2xl text-accent-from">
          <LogoMark />
        </div>
        <h2 className="text-2xl font-semibold">{copy.successTitle}</h2>
        <p className="max-w-[32ch] text-sm text-foreground/60">{copy.successBody}</p>
        <PillButton variant="dark" onClick={onDone}>
          Close
        </PillButton>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60">
          <i className="block size-1.5 rounded-pill bg-accent" />
          {copy.kicker}
        </span>
        <h2 className="text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{copy.heading}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name">
          <input type="text" name="name" required placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Email">
          <input
            type="email"
            name="email"
            required
            placeholder="you@company.com"
            autoComplete="email"
          />
        </Field>
        <Field label={copy.projectLabel}>
          <textarea name="project" rows={4} required placeholder={copy.projectPlaceholder} />
        </Field>

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-xs text-foreground/45">{copy.note}</span>
          <PillButton variant="dark" withArrow arrow="up-right" type="submit">
            {status === 'submitting' ? 'Sending…' : copy.submitLabel}
          </PillButton>
        </div>
      </form>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 [&_input]:w-full [&_input]:rounded-control [&_input]:border [&_input]:border-line [&_input]:bg-surface/50 [&_input]:px-4 [&_input]:py-3 [&_input]:text-sm [&_input]:transition [&_input]:outline-none focus:[&_input]:border-foreground/30 focus:[&_input]:bg-background [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-control [&_textarea]:border [&_textarea]:border-line [&_textarea]:bg-surface/50 [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-sm [&_textarea]:transition [&_textarea]:outline-none focus:[&_textarea]:border-foreground/30 focus:[&_textarea]:bg-background">
      <span className="text-xs font-medium tracking-[0.025em] text-foreground/50 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
