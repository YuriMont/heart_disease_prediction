import { atom } from 'jotai';
import type { PatientResponse } from '../generated/models';

export const selectedPatientAtom = atom<PatientResponse | null>(null);
