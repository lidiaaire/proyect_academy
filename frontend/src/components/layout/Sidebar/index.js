'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/Sidebar.module.css';

const NAV_LINKS = [
  { href: '/dashboard',    label: 'Dashboard' },
  { href: '/courses',      label: 'Courses' },
  { href: '/enrollments',  label: 'Enrollments' },
  { href: '/progress',     label: 'Progress' },
];

const ADMIN_LINKS = [
  { href: '/users', label: 'Users' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const links = user?.role === 'admin'
    ? [...NAV_LINKS, ...ADMIN_LINKS]
    : NAV_LINKS;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Elevate Your English</div>

      {user && (
        <div className={styles.userBlock}>
          <span className={styles.userName}>{user.firstName} {user.lastName}</span>
          <span className={styles.role}>{user.role}</span>
        </div>
      )}

      <nav className={styles.nav}>
        {links.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
