// Trap focus inside a modal element, returns a cleanup function
export function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return () => {};
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handler = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    };
    modal.addEventListener('keydown', handler);
    first.focus();
    return () => modal.removeEventListener('keydown', handler);
}
