import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { isAdminAuthenticated } from '@/lib/auth/admin-session';
import { Logo } from '@/components/layout/logo';

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) redirect('/admin');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f2ea] px-4 dark:bg-[#0c0906]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center"><Logo href={"/admin/login" as any} /></div>
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Private owner access</p>
          <h1 className="font-serif text-4xl text-stone-900 dark:text-white">Admin login</h1>
          <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">Use the environment-configured owner credentials to access bookings, pricing, availability, analytics, and content operations.</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
