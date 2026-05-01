import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users, Stethoscope, Calendar, FileText, Plus, Pencil, Power, PowerOff,
  CheckCircle, XCircle, Search, X
} from 'lucide-react';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  bio: string;
  phone: string;
  email: string;
  consultation_fee: number;
  is_active: boolean;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  guest_name: string;
  guest_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  type: string;
  notes: string;
  profiles: { full_name: string; email: string } | null;
  doctors: { full_name: string; specialization: string } | null;
}

interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  blood_type: string;
}

interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  visit_date: string;
}

type Tab = 'doctors' | 'appointments' | 'patients' | 'records';

const emptyDoctor = {
  full_name: '', specialization: '', qualification: '', experience_years: 0,
  bio: '', phone: '', email: '', consultation_fee: 100,
};

export default function Admin() {
  const [tab, setTab] = useState<Tab>('doctors');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Doctor form
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [doctorLoading, setDoctorLoading] = useState(false);

  // Medical record form
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recordForm, setRecordForm] = useState({ patient_id: '', doctor_id: '', diagnosis: '', prescription: '', notes: '', visit_date: '' });
  const [recordLoading, setRecordLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [dRes, aRes, pRes, rRes] = await Promise.all([
      supabase.from('doctors').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('id, patient_id, doctor_id, guest_name, guest_email, appointment_date, appointment_time, status, type, notes, profiles(full_name, email), doctors(full_name, specialization)').order('appointment_date', { ascending: false }),
      supabase.from('profiles').select('id, full_name, email, phone, gender, blood_type').order('full_name'),
      supabase.from('medical_records').select('*').order('visit_date', { ascending: false }),
    ]);
    setDoctors(dRes.data || []);
    setAppointments(aRes.data || []);
    setPatients(pRes.data || []);
    setRecords(rRes.data || []);
    setLoading(false);
  };

  // Doctor CRUD
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorLoading(true);
    if (editingDoctor) {
      await supabase.from('doctors').update({ ...doctorForm, updated_at: new Date().toISOString() }).eq('id', editingDoctor);
    } else {
      await supabase.from('doctors').insert(doctorForm);
    }
    setShowDoctorForm(false);
    setEditingDoctor(null);
    setDoctorForm(emptyDoctor);
    setDoctorLoading(false);
    fetchAll();
  };

  const toggleDoctor = async (doc: Doctor) => {
    await supabase.from('doctors').update({ is_active: !doc.is_active, updated_at: new Date().toISOString() }).eq('id', doc.id);
    fetchAll();
  };

  const editDoctor = (doc: Doctor) => {
    setEditingDoctor(doc.id);
    setDoctorForm({
      full_name: doc.full_name,
      specialization: doc.specialization,
      qualification: doc.qualification,
      experience_years: doc.experience_years,
      bio: doc.bio,
      phone: doc.phone,
      email: doc.email,
      consultation_fee: doc.consultation_fee,
    });
    setShowDoctorForm(true);
  };

  // Appointment status
  const updateAppointmentStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAll();
  };

  // Medical record
  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecordLoading(true);
    await supabase.from('medical_records').insert(recordForm);
    setShowRecordForm(false);
    setRecordForm({ patient_id: '', doctor_id: '', diagnosis: '', prescription: '', notes: '', visit_date: '' });
    setRecordLoading(false);
    fetchAll();
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: 'doctors', label: 'Doctors', icon: Stethoscope, count: doctors.length },
    { key: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
    { key: 'patients', label: 'Patients', icon: Users, count: patients.length },
    { key: 'records', label: 'Medical Records', icon: FileText, count: records.length },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="mt-1 text-gray-400">Manage doctors, appointments, patients, and records</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
              tab === t.key
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-400 hover:text-white bg-gray-900/50 border border-gray-800'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            <span className={`px-1.5 py-0.5 text-xs rounded-md ${
              tab === t.key ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-500'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Doctors Tab */}
      {tab === 'doctors' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
              />
            </div>
            <button
              onClick={() => { setShowDoctorForm(true); setEditingDoctor(null); setDoctorForm(emptyDoctor); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Doctor
            </button>
          </div>

          {/* Doctor Form Modal */}
          {showDoctorForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                  <button onClick={() => { setShowDoctorForm(false); setEditingDoctor(null); }} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input type="text" value={doctorForm.full_name} onChange={e => setDoctorForm({ ...doctorForm, full_name: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Specialization</label>
                      <input type="text" value={doctorForm.specialization} onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Qualification</label>
                      <input type="text" value={doctorForm.qualification} onChange={e => setDoctorForm({ ...doctorForm, qualification: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Experience (years)</label>
                      <input type="number" value={doctorForm.experience_years} onChange={e => setDoctorForm({ ...doctorForm, experience_years: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                      <input type="tel" value={doctorForm.phone} onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input type="email" value={doctorForm.email} onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Consultation Fee ($)</label>
                      <input type="number" value={doctorForm.consultation_fee} onChange={e => setDoctorForm({ ...doctorForm, consultation_fee: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                    <textarea value={doctorForm.bio} onChange={e => setDoctorForm({ ...doctorForm, bio: e.target.value })} rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={doctorLoading} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-sm">
                      {doctorLoading ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                    </button>
                    <button type="button" onClick={() => { setShowDoctorForm(false); setEditingDoctor(null); }} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Doctors list */}
          <div className="space-y-3">
            {doctors
              .filter(d => d.full_name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()))
              .map(doc => (
                <div key={doc.id} className={`bg-gray-900/50 border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${doc.is_active ? 'border-gray-800' : 'border-gray-800 opacity-60'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{doc.full_name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${doc.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {doc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {doc.specialization} &middot; {doc.qualification} &middot; {doc.experience_years} yrs &middot; ${doc.consultation_fee}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{doc.email} &middot; {doc.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => editDoctor(doc)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleDoctor(doc)} className={`p-2 rounded-lg transition-all ${doc.is_active ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10'}`} title={doc.is_active ? 'Deactivate' : 'Activate'}>
                      {doc.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {tab === 'appointments' && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="text-center py-16 bg-gray-900/30 border border-gray-800 rounded-2xl">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No appointments found</p>
            </div>
          ) : appointments.map(appt => (
            <div key={appt.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">
                      {appt.profiles?.full_name || appt.guest_name || 'Guest'}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border capitalize ${statusColor[appt.status] || ''}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {appt.doctors?.full_name || 'Doctor TBD'} &middot; {appt.doctors?.specialization}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>{appt.appointment_date}</span>
                    <span>{appt.appointment_time}</span>
                    <span className="capitalize">{appt.type}</span>
                  </div>
                  {appt.notes && <p className="text-sm text-gray-500 mt-1">{appt.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {appt.status === 'pending' && (
                    <button onClick={() => updateAppointmentStatus(appt.id, 'confirmed')} className="px-3 py-1.5 text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Confirm
                    </button>
                  )}
                  {(appt.status === 'pending' || appt.status === 'confirmed') && (
                    <>
                      <button onClick={() => updateAppointmentStatus(appt.id, 'completed')} className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Complete
                      </button>
                      <button onClick={() => updateAppointmentStatus(appt.id, 'cancelled')} className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patients Tab */}
      {tab === 'patients' && (
        <div className="space-y-3">
          {patients.length === 0 ? (
            <div className="text-center py-16 bg-gray-900/30 border border-gray-800 rounded-2xl">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No patients found</p>
            </div>
          ) : patients.map(p => (
            <div key={p.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">{p.full_name || 'Unnamed'}</div>
                <div className="text-sm text-gray-400">{p.email}</div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                  {p.phone && <span>{p.phone}</span>}
                  {p.gender && <span>{p.gender}</span>}
                  {p.blood_type && <span className="text-red-400">{p.blood_type}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medical Records Tab */}
      {tab === 'records' && (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowRecordForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>

          {/* Record Form Modal */}
          {showRecordForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Add Medical Record</h2>
                  <button onClick={() => setShowRecordForm(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleRecordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Patient</label>
                    <select value={recordForm.patient_id} onChange={e => setRecordForm({ ...recordForm, patient_id: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none" required>
                      <option value="">Select patient</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Doctor</label>
                    <select value={recordForm.doctor_id} onChange={e => setRecordForm({ ...recordForm, doctor_id: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none" required>
                      <option value="">Select doctor</option>
                      {doctors.filter(d => d.is_active).map(d => <option key={d.id} value={d.id}>{d.full_name} ({d.specialization})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Diagnosis</label>
                    <input type="text" value={recordForm.diagnosis} onChange={e => setRecordForm({ ...recordForm, diagnosis: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Prescription</label>
                    <textarea value={recordForm.prescription} onChange={e => setRecordForm({ ...recordForm, prescription: e.target.value })} rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                    <textarea value={recordForm.notes} onChange={e => setRecordForm({ ...recordForm, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Visit Date</label>
                    <input type="date" value={recordForm.visit_date} onChange={e => setRecordForm({ ...recordForm, visit_date: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={recordLoading} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-sm">
                      {recordLoading ? 'Saving...' : 'Add Record'}
                    </button>
                    <button type="button" onClick={() => setShowRecordForm(false)} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {records.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/30 border border-gray-800 rounded-2xl">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No medical records found</p>
              </div>
            ) : records.map(rec => (
              <div key={rec.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <div className="text-sm text-gray-300 font-medium">{rec.diagnosis}</div>
                {rec.prescription && <div className="text-sm text-gray-400 mt-1">Rx: {rec.prescription}</div>}
                {rec.notes && <div className="text-sm text-gray-500 mt-1">{rec.notes}</div>}
                <div className="text-xs text-gray-500 mt-2">Visit: {rec.visit_date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
