import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import { useShine } from '../hooks/use-shine';

describe('useShine', () => {
  it('should update --x and --y css variables on mousemove', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useShine(ref);
      return ref;
    });

    const mockDiv = document.createElement('div');
    result.current.current = mockDiv;

    // Simulate a mousemove event
    act(() => {
      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
      });
      mockDiv.getBoundingClientRect = () => ({
        left: 50,
        top: 150,
        x: 50,
        y: 150,
        width: 0,
        height: 0,
        bottom: 0,
        right: 0,
        toJSON: () => {},
      });
      mockDiv.dispatchEvent(mouseMoveEvent);
    });

    expect(mockDiv.style.getPropertyValue('--x')).toBe('50px');
    expect(mockDiv.style.getPropertyValue('--y')).toBe('50px');
  });
});
