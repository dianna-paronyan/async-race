import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCarPosition, setCarRacing } from '../app/features/carSlice.ts';
import CarService from '../core/services/car.service.ts';
import type { CarModel } from '../core/models/car.model.ts';

export const useCarAnimation = (car: CarModel) => {
  const carRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const dispatch = useDispatch();
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (carRef.current) {
      carRef.current.style.transform = `translateX(${car.position}px)`;
    }
  }, [car.position]);

  const resetCar = () => {
    if (carRef.current) {
      carRef.current.style.transform = `translateX(0px)`;
    }
    dispatch(setCarPosition({ id: car.id, position: 0 }));
    dispatch(setCarRacing({ id: car.id, racing: false }));
  };

  const start = async () => {
    if (!carRef.current || !trackRef.current) return null;

    resetCar();
    if (car.racing) return null;

    stoppedRef.current = false;
    dispatch(setCarRacing({ id: car.id, racing: true }));

    try {
      const { velocity, distance } = await CarService.startEngine(car.id);
      const duration = distance / velocity;

      const trackWidth = trackRef.current.offsetWidth;
      const carWidth = carRef.current.offsetWidth;
      const targetX = trackWidth - carWidth;

      const animation = carRef.current.animate(
        [{ transform: `translateX(0px)` }, { transform: `translateX(${targetX}px)` }],
        { duration, fill: 'forwards', easing: 'linear' },
      );

      animationRef.current = animation;

      animation.onfinish = () => {
        if (!stoppedRef.current) {
          dispatch(setCarPosition({ id: car.id, position: targetX }));
          dispatch(setCarRacing({ id: car.id, racing: false }));
        }
      };

      await CarService.drive(car.id);

      return { id: car.id, time: duration / 1000, name: car.name ?? 0 };
    } catch (error) {
      console.warn('Start failed', error);
      resetCar();
      return null;
    }
  };

  const stop = async () => {
    stoppedRef.current = true;

    if (animationRef.current) animationRef.current.cancel();
    try {
      await CarService.stopEngine(car.id);
    } catch (error) {
      console.warn('Stop failed', error);
    }

    resetCar();
  };

  return { carRef, trackRef, start, stop };
};
