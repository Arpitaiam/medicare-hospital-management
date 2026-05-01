import { Activity, Heart, Shield, Users, Award, Globe } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Heart, title: 'Compassionate Care', desc: 'We treat every patient with empathy, dignity, and respect, ensuring comfort throughout their healthcare journey.' },
    { icon: Shield, title: 'Trust & Safety', desc: 'Your health data is protected with enterprise-grade security and strict privacy protocols.' },
    { icon: Award, title: 'Excellence', desc: 'Our doctors are leaders in their fields, committed to the highest standards of medical practice.' },
    { icon: Globe, title: 'Accessibility', desc: 'Quality healthcare should be available to everyone, everywhere, at any time.' },
  ];

  const team = [
    { name: 'Dr. Sarah Mitchell', role: 'Chief Medical Officer', spec: 'Cardiology' },
    { name: 'Dr. James Chen', role: 'Head of Surgery', spec: 'Orthopedics' },
    { name: 'Dr. Amara Okafor', role: 'Director of Pediatrics', spec: 'Pediatrics' },
    { name: 'Dr. Elena Vasquez', role: 'Head of Neurology', spec: 'Neurology' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
          <Activity className="w-4 h-4" />
          About MediCare
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Transforming Healthcare{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            for Everyone
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 leading-relaxed">
          MediCare was founded with a simple mission: make quality healthcare accessible, efficient, and patient-centered. We connect patients with top medical professionals through a seamless digital platform.
        </p>
      </div>

      {/* Values */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Our Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center hover:border-emerald-500/20 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Leadership Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold">{t.name}</h3>
              <p className="text-emerald-400 text-sm font-medium">{t.role}</p>
              <p className="text-gray-500 text-xs mt-1">{t.spec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-gray-400 leading-relaxed">
          To bridge the gap between patients and healthcare providers through technology, ensuring that every individual has access to timely, quality medical care regardless of their location or circumstances.
        </p>
      </div>
    </div>
  );
}
