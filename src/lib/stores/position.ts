import { writable } from 'svelte/store';

export const position = writable({
	x: 0,
	y: 0
});

export const updatePosition = (x: number, y: number) => {
	position.set({ x, y });
};
