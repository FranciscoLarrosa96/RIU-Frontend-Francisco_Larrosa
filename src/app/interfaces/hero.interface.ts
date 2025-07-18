export interface Hero {
  id: number;
  name: string;
  alias: string;
  superpowers: string[];
  universe: 'marvel' | 'dc';
  active: boolean;
}