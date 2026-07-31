import React from 'react';
import { motion } from 'motion/react';
import { useApp, TabType } from '../context/AppContext';
import { 
  Users, 
  CalendarCheck, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  ArrowRight, 
  Sparkles, 
  Building, 
  Clock, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  Search,
  CheckCircle2,
  Stethoscope,
  Award
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    setActiveTab, 
    doctors, 
    visits, 
    repProfile, 
    setSelectedDoctorForModal
  } = useApp();

  const upcomingVisits = visits.filter(v => v.status === 'Scheduled').slice(0, 2);
  const classADoctors = doctors.filter(d => d.doctorClass === 'Class A').length;

  const mainModules: {
    id: TabType;
    title: string;
    description: string;
    icon: React.ReactNode;
    badgeText?: string;
    bgColor: string;
    iconColor: string;
    badgeBg: string;
    badgeTextColor: string;
  }[] = [
    {
      id: 'doctors',
      title: 'Doctors',
      description: 'Manage physician profiles, prescribing habits, hospital affiliations, and contact records.',
      icon: <Users className="w-8 h-8" />,
      badgeText: `${doctors.length} Physicians`,
      bgColor: 'bg-blue-50/80',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-100',
      badgeTextColor: 'text-blue-800'
    },
    {
      id: 'visits',
      title: 'Visits',
      description: 'Access scheduled calls, pre-visit preparation briefs, and post-visit interaction logs.',
      icon: <CalendarCheck className="w-8 h-8" />,
      badgeText: `${visits.length} Visit History`,
      bgColor: 'bg-emerald-50/80',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100',
      badgeTextColor: 'text-emerald-800'
    },
    {
      id: 'knowledge',
      title: 'Knowledge Base',
      description: 'Explore clinical trial publications, product monographs, studies, and scientific PDFs.',
      icon: <BookOpen className="w-8 h-8" />,
      badgeText: 'Scientific Data',
      bgColor: 'bg-indigo-50/80',
      iconColor: 'text-indigo-600',
      badgeBg: 'bg-indigo-100',
      badgeTextColor: 'text-indigo-800'
    },
    {
      id: 'objections',
      title: 'Objections',
      description: 'Search instant battlecards, physician pushback answers, and study citations.',
      icon: <HelpCircle className="w-8 h-8" />,
      badgeText: 'Instant Battlecards',
      bgColor: 'bg-amber-50/80',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-amber-100',
      badgeTextColor: 'text-amber-800'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure representative profile, territory parameters, and offline database preferences.',
      icon: <Settings className="w-8 h-8" />,
      badgeText: 'Account & Territory',
      bgColor: 'bg-slate-100/80',
      iconColor: 'text-slate-700',
      badgeBg: 'bg-slate-200',
      badgeTextColor: 'text-slate-800'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto pb-12">
      {/* Welcome Banner Card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-blue-50 border border-white/20">
              {repProfile.territory || 'Central District'}
            </span>
            <span className="text-xs text-blue-100 flex items-center gap-1.5 font-medium bg-blue-800/40 px-2.5 py-1 rounded-full border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>RepMind AI</span>
            </span>
          </div>

          <div className="pt-1 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome Back 👋
            </h1>
            <p className="text-sm text-blue-100 font-medium italic">
              "Be Ready Before You Go" — Your AI Preparation Assistant
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3 text-xs">
            <div className="bg-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-xs border border-white/10">
              <span className="block text-blue-200 text-[10px] font-medium uppercase tracking-wider">Total Doctors</span>
              <span className="font-extrabold text-lg text-white">{doctors.length}</span>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-xs border border-white/10">
              <span className="block text-blue-200 text-[10px] font-medium uppercase tracking-wider">Class A Targets</span>
              <span className="font-extrabold text-lg text-white">{classADoctors}</span>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-xs border border-white/10">
              <span className="block text-blue-200 text-[10px] font-medium uppercase tracking-wider">Scheduled Visits</span>
              <span className="font-extrabold text-lg text-white">{upcomingVisits.length}</span>
            </div>
          </div>
        </div>

        {/* Decorative background ambient glow */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Main Core Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Navigation Dashboard
          </h2>
          <span className="text-xs text-slate-500 font-medium">Select a module</span>
        </div>

        {/* Premium Cards Grid: Doctors, Visits, Knowledge Base, Objections, Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainModules.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveTab(item.id)}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  {/* Large Icon Container */}
                  <div className={`w-14 h-14 rounded-2xl ${item.bgColor} ${item.iconColor} flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                    {item.icon}
                  </div>

                  {/* Badge & Arrow */}
                  <div className="flex items-center gap-2">
                    {item.badgeText && (
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.badgeBg} ${item.badgeTextColor}`}>
                        {item.badgeText}
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center text-slate-400 shrink-0">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>Open {item.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Up Next Visit Brief Shortcut Card */}
      {upcomingVisits.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Next Scheduled Call</span>
            </h3>
            <button
              onClick={() => setActiveTab('visits')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All Visits
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">
                  {upcomingVisits[0].doctorName}
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                  {upcomingVisits[0].doctorSpecialty}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{upcomingVisits[0].doctorHospital} • Today {upcomingVisits[0].time}</span>
              </p>
            </div>

            <button
              onClick={() => {
                const targetDoc = doctors.find(d => d.id === upcomingVisits[0].doctorId || d.name === upcomingVisits[0].doctorName) || doctors[0];
                setSelectedDoctorForModal(targetDoc);
                setActiveTab('visit-brief');
              }}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Prepare Visit Brief</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

