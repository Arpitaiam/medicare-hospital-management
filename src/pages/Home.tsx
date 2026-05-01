import { useApp } from '../contexts/AppContext';
import { Activity, Calendar, Users, Shield, Stethoscope, Clock, ArrowRight, Heart, Star } from 'lucide-react';

export default function Home() {
  const { setPage } = useApp();

  const features = [
    { icon: Stethoscope, title: 'Expert Doctors', desc: 'Access a network of highly qualified specialists across all medical fields.' },
    { icon: Calendar, title: 'Easy Booking', desc: 'Book appointments in seconds with your preferred doctor, anytime.' },
    { icon: Shield, title: 'Secure Records', desc: 'Your medical records are encrypted and accessible only to you.' },
    { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock assistance for all your healthcare needs.' },
    { icon: Heart, title: 'Patient Care', desc: 'Compassionate care tailored to your individual health journey.' },
    { icon: Users, title: 'Admin Dashboard', desc: 'Powerful management tools for hospital administrators.' },
  ];

  const stats = [
    { value: '150+', label: 'Expert Doctors' },
    { value: '50k+', label: 'Patients Served' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
              <Activity className="w-4 h-4" />
              Trusted Healthcare Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Your Health, Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Priority
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              MediCare connects you with top medical professionals, seamless appointment booking, and secure health record management — all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setPage('book-appointment')}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage('doctors')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700"
              >
                Find Doctors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Choose MediCare</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Everything you need for a seamless healthcare experience
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-gray-900/50 border border-gray-800 hover:border-emerald-500/30 rounded-2xl p-6 transition-all hover:bg-gray-900/80 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative text-center max-w-2xl mx-auto">
            <Star className="w-10 h-10 text-emerald-200 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Get Started?</h2>
            <p className="mt-4 text-emerald-100/80">
              Join thousands of patients who trust MediCare for their healthcare needs.
            </p>
            <button
              onClick={() => setPage('auth')}
              className="mt-8 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-white">MediCare</span>
          </div>
          <p className="text-sm text-gray-500">&copy; 2026 MediCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
