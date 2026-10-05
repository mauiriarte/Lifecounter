export type OutReason = 'life' | 'poison' | 'cmdr';

export const DOOM: Record<OutReason, string[]> = {
  life: [
    'The grave keeps what it takes.',
    'Your light is spent. Only silence remains.',
    'Dust returns to dust.',
    'No spell can call you back now.',
    'The crows have already begun to gather.',
    'Your name fades from the battlefield.',
  ],
  poison: [
    'The oil has reached your heart.',
    'Compleated. Nothing of you remains.',
    'Venom sings you to sleep.',
    'Your flesh belongs to the machine now.',
  ],
  cmdr: [
    "Struck down by a commander's hand.",
    'Your banner falls, trampled in the dark.',
    "A general's blade found your throat.",
    'Twenty-one cuts. One ending.',
  ],
};
