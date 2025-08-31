import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCarPosition, setCarRacing } from '../app/features/carSlice.ts';
import CarService from '../core/services/car.service.ts';
import type { CarModel } from '../core/models/car.model.ts';
import type { AppDispatch } from '../app/store.tsx';

export const useCarAnimation = (car: CarModel) => {
  const carRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (carRef.current) {
      carRef.current.style.transform = `translateX(${car.position}px)`;
    }
  }, [car.position]);

  const start = async (): Promise<{ id: number; time: number; name: string } | null> => {
    if (!carRef.current || !trackRef.current || car.racing) return null;

    dispatch(setCarRacing({ id: car.id, racing: true }));

    try {
      const { velocity, distance } = await CarService.startEngine(car.id);
      const duration = distance / velocity;

      const trackWidth = trackRef.current.offsetWidth;
      const carWidth = carRef.current.offsetWidth;
      const targetX = trackWidth - carWidth;

      const animation = carRef.current.animate(
        [{ transform: `translateX(${car.position}px)` }, { transform: `translateX(${targetX}px)` }],
        { duration, fill: 'forwards', easing: 'linear' },
      );
      animationRef.current = animation;

      try {
        await CarService.drive(car.id);
        animation.finish();
      } catch (err: any) {
        if (err.response?.status === 500) {
          console.warn('Car engine failed');
        } else {
          throw err;
        }
      }

      dispatch(setCarPosition({ id: car.id, position: targetX }));
      dispatch(setCarRacing({ id: car.id, racing: false }));

      return { id: car.id, time: duration / 1000, name: car.name };
    } catch (err) {
      dispatch(setCarRacing({ id: car.id, racing: false }));
      return null;
    }
  };

  const stop = async () => {
    if (animationRef.current) animationRef.current.cancel();
    if (carRef.current) carRef.current.style.transform = `translateX(0px)`;

    try {
      await CarService.stopEngine(car.id);
    } catch (err) {
      console.warn('Failed to stop engine', err);
    }

    dispatch(setCarPosition({ id: car.id, position: 0 }));
    dispatch(setCarRacing({ id: car.id, racing: false }));
  };

  return { carRef, trackRef, start, stop };
};
