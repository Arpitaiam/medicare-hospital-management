import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, FileText, Clock, User, Stethoscope, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  type: string;
  notes: string;
  doctors: { full_name: string; specialization: string } | null;
}

interface MedicalRecord {
  id: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  visit_date: string;
  doctors: { full_name: string; specialization: string } | null;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'appointments' | 'records'>('appointments');

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const [apptRes, recRes] = await Promise.all([
      supabase
        .from('appointments')
        .select('id, doctor_id, appointment_date, appointment_time, status, type, notes, doctors(full_name, specialization)')
        .eq('patient_id', user!.id)
        .order('appointment_date', { ascending: false }),
      supabase
        .from('medical_records')
        .select('id, diagnosis, prescription, notes, visit_date, doctors(full_name, specialization)')
        .eq('patient_id', user!.id)
        .order('visit_date', { ascending: false }),
    ]);
    setAppointments(apptRes.data || []);
    setRecords(recRes.data || []);
    setLoading(false);
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Patient Dashboard</h1>
        <p className="mt-1 text-gray-400">Welcome back, {profile?.full_name || 'Patient'}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{appointments.length}</div>
          <div className="text-sm text-gray-400">Total Appointments</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-400">{appointments.filter(a => a.status === 'pending').length}</div>
          <div className="text-sm text-gray-400">Pending</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-400">{appointments.filter(a => a.status === 'completed').length}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400">{records.length}</div>
          <div className="text-sm text-gray-400">Medical Records</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900/50 border border-gray-800 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setTab('appointments')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            tab === 'appointments' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Appointments</span>
        </button>
        <button
          onClick={() => setTab('records')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            tab === 'records' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Medical Records</span>
        </button>
      </div>

      {/* Content */}
      {tab === 'appointments' ? (
        appointments.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/30 border border-gray-800 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No appointments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-white font-medium truncate">
                      {appt.doctors?.full_name || 'Doctor TBD'}
                    </span>
                    <span className="text-gray-500 text-sm">— {appt.doctors?.specialization}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {appt.appointment_date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {appt.appointment_time}</span>
                    <span className="capitalize">{appt.type}</span>
                  </div>
                  {appt.notes && <p className="mt-2 text-sm text-gray-500">{appt.notes}</p>}
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${statusColor[appt.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        records.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/30 border border-gray-800 rounded-2xl">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No medical records yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map(rec => (
              <div key={rec.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-medium">{rec.doctors?.full_name || 'Doctor'}</span>
                  <span className="text-gray-500 text-sm">— {rec.doctors?.specialization}</span>
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  <span className="font-medium text-gray-300">Diagnosis:</span> {rec.diagnosis}
                </div>
                {rec.prescription && (
                  <div className="text-sm text-gray-400 mb-1">
                    <span className="font-medium text-gray-300">Prescription:</span> {rec.prescription}
                  </div>
                )}
                {rec.notes && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-400">Notes:</span> {rec.notes}
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">Visit: {rec.visit_date}</div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
