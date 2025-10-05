import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      {/* Light mode logo */}
      <Image 
        src="/black logo.svg" 
        alt="UltraFolio Logo" 
        width={28} 
        height={28}
        className="block dark:hidden"
      />
      {/* Dark mode logo */}
      <Image 
        src="/white logo.svg" 
        alt="UltraFolio Logo" 
        width={28} 
        height={28}
        className="hidden dark:block"
      />

      <span className="font-bold text-lg text-foreground">UltraFolio</span>
    </Link>
  );
}
