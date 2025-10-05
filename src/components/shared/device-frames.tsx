import type { ReactNode } from 'react';

interface FrameProps {
  children: ReactNode;
}

export function MacbookFrame({ children }: FrameProps) {
  return (
    <div className="w-full mx-auto bg-neutral-900 rounded-lg shadow-lg">
      <div className="relative p-2 pt-6 bg-neutral-800 dark:bg-neutral-900/50 rounded-t-lg">
        <div className="absolute top-2.5 left-4 flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="bg-black rounded-md overflow-hidden aspect-video">
          {children}
        </div>
      </div>
      <div className="bg-neutral-800/70 h-3 rounded-b-lg shadow-inner"></div>
    </div>
  );
}

export function IphoneFrame({ children }: FrameProps) {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
        <div className="w-[12px] h-[12px] bg-gray-800 absolute top-[124px] left-[-16px] rounded-l-lg"></div>
        <div className="w-[12px] h-[46px] bg-gray-800 absolute top-[178px] left-[-16px] rounded-l-lg"></div>
        <div className="w-[12px] h-[46px] bg-gray-800 absolute top-[232px] left-[-16px] rounded-l-lg"></div>
        <div className="w-[12px] h-[64px] bg-gray-800 absolute top-[168px] right-[-16px] rounded-r-lg"></div>
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-black">
            {children}
        </div>
    </div>
  );
}
