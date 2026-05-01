import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, User, Mail, Phone, Stethoscope, FileText, Clock, CheckCircle } from 'lucide-react';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  consultation_fee: number;
}

export default function BookAppointment() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    doctor_id: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
    type: 'consultation',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('id, full_name, specialization, consultation_fee')
      .eq('is_active', true)
      .order('full_name');
    setDoctors(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const appointment: any = {
      doctor_id: form.doctor_id || null,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      notes: form.notes,
      type: form.type,
      status: 'pending',
    };

    if (user) {
      appointment.patient_id = user.id;
    } else {
      appointment.guest_name = form.guest_name;
      appointment.guest_email = form.guest_email;
      appointment.guest_phone = form.guest_phone;
    }

    const { error } = await supabase.from('appointments').insert(appointment);

    if (!error) {
      setSuccess(true);
      setForm({
        doctor_id: '',
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        appointment_date: '',
        appointment_time: '',
        notes: '',
        type: 'consultation',
      });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Appointment Booked!</h2>
          <p className="text-gray-400 mb-6">Your appointment has been scheduled successfully. You will receive a confirmation shortly.</p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-xl transition-colors"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Book Appointment</h1>
        <p className="mt-3 text-gray-400">Schedule a visit with one of our specialists</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-5">
        {/* Guest info if not logged in */}
        {!user && (
          <div className="space-y-4 pb-5 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Your Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={form.guest_email}
                    onChange={(e) => setForm({ ...form, guest_email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={form.guest_phone}
                    onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    placeholder="+1 234 567 890"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Appointment Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Doctor</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={form.doctor_id}
                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.full_name} — {d.specialization} (${d.consultation_fee})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
                  required
                >
                  <option value="">Select time</option>
                  {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
                    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM']
                    .map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
              <option value="checkup">Regular Checkup</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes (optional)</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                placeholder="Describe your symptoms or reason for visit..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              Book Appointment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
