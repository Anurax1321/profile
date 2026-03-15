import { useInView } from 'react-intersection-observer';

export function useScrollReveal() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return { ref, isInView: inView };
}
