import { Collision } from '../types';
import raw from './collisions.json';

export const COLLISIONS = raw as Record<string, Collision>;
