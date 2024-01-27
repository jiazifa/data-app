
import Link from 'next/link';

export default function AppInnerPage() {
  return (
    <>
      Welcome!
      <Link href="/manager" passHref>
        Go To Manager Page
      </Link>
    </>
  );
}
