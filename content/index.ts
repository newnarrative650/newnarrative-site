import ru from './ru.json';

// Тексты лежат в content/ru.json. Чтобы добавить английский, положите рядом en.json
// с той же структурой и выберите словарь по локали.
export type Content = typeof ru;
export const content: Content = ru;

export type Link = { label: string; href: string | null };
