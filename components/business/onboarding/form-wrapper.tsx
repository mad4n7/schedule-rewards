'use client';

interface FormWrapperProps {
  children: React.ReactNode;
}

export function FormWrapper({ children }: FormWrapperProps) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}
