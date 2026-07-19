import { Shoe } from '../types';
import { SHOES_PART1 } from './part1';
import { SHOES_PART2 } from './part2';
import { SHOES_PART3 } from './part3';
import { SHOES_PART4 } from './part4';

export const SHOES: Shoe[] = [
  ...SHOES_PART1,
  ...SHOES_PART2,
  ...SHOES_PART3,
  ...SHOES_PART4,
];
