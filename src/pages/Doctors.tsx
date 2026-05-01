import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { Stethoscope, Search, Clock, DollarSign, Award, User } from 'lucide-react';

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

export default function Doctors() {
  const { setPage } = useApp();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('full_name');
    setDoctors(data || []);
    setLoading(false);
  };

  const specializations = [...new Set(doctors.map(d => d.specialization))];
  const filtered = doctors.filter(d => {
    const matchSearch = d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !specFilter || d.specialization === specFilter;
    return matchSearch && matchSpec;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Our Doctors</h1>
        <p className="mt-3 text-gray-400">Meet our team of experienced medical professionals</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>
        <select
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        >
          <option value="">All Specializations</option>
          {specializations.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Stethoscope className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No doctors found matching your criteria</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-gray-900/50 border border-gray-800 hover:border-emerald-500/30 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{doctor.full_name}</h3>
                  <p className="text-emerald-400 text-sm font-medium">{doctor.specialization}</p>
                </div>
              </div>

              {doctor.qualification && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Award className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>{doctor.qualification}</span>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{doctor.experience_years} yrs exp</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>${doctor.consultation_fee}</span>
                </div>
              </div>

              {doctor.bio && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{doctor.bio}</p>
              )}

              <button
                onClick={() => setPage('book-appointment')}
                className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
