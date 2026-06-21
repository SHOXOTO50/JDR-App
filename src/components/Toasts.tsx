import { useEffect } from 'react';
import { useGame } from '../store/gameStore';

export default function Toasts() {
  const notifications = useGame((s) => s.notifications);
  const dismiss = useGame((s) => s.dismissNotification);

  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((n) => setTimeout(() => dismiss(n.id), 3200));
    return () => timers.forEach(clearTimeout);
  }, [notifications, dismiss]);

  if (notifications.length === 0) return null;
  return (
    <div className="toasts">
      {notifications.slice(-4).map((n) => (
        <div key={n.id} className={`toast ${n.kind}`} onClick={() => dismiss(n.id)}>
          {n.text}
        </div>
      ))}
    </div>
  );
}
