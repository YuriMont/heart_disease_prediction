import { useEffect, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { selectedPatientAtom } from '../../atoms/patient';

interface RequirePatientGuardProps {
  children: ReactNode;
}

export function RequirePatientGuard({ children }: RequirePatientGuardProps) {
  const [selectedPatient] = useAtom(selectedPatientAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedPatient) {
      navigate({ to: '/patients' });
    }
  }, [selectedPatient, navigate]);

  if (!selectedPatient) {
    return null;
  }

  return <>{children}</>;
}
