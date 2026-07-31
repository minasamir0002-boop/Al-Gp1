import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, TrendingUp, Users, ShieldAlert, Award, Calendar, Activity, ChevronRight, BarChart3, PieChart, AlertCircle, CheckCircle } from 'lucide-react';

export const TerritoryAnalyticsView: React.FC = () => {
  const { doctors, visits, repProfile, quickNavigateToRecordVisitWithDoctor } = useApp();
  const [selectedTerritoryFilter, setSelectedTerritoryFilter] = useState<string>('All');

  // Calculate Territory Health Score
  const totalDoctors = doctors.length;
  const visitedThisMonth = doctors.filter(d => d.totalVisitsThisMonth > 0).length;
  const coverageRate = Math.round((visitedThisMonth / (totalDoctors || 1)) * 100);
  
  const classADoctors = doctors.filter(d => d.doctorClass === 'Class A');
  const classABVisited = classADoctors.filter(d => d.totalVisitsThisMonth >= d.targetVisitsPerMonth).length;
  const frequencyRate = Math.round((classABVisited / (classADoctors.length || 1)) * 100);

  const healthScore = Math.min(100, Math.round(coverageRate * 0.5 + frequencyRate * 0.5));

  // Doctor Class breakdown
  const classA = doctors.filter(d => d.doctorClass === 'Class A').length;
  const classB = doctors.filter(d => d.doctorClass === 'Class B').length;
  const classC = doctors.filter(d => d.doctorClass === 'Class C').length;

  // Territory breakdown
  const territories = ['Central District', 'North Sector', 'South Bay', 'Metro West'];
  
  // Missed Doctors (0 visits this month)
  const missedDoctors = doctors.filter(d => d.totalVisitsThisMonth === 0);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Top Header & AI Health Score */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">
                Live Territory Intelligence
              </span>
              <span className="text-slate-400 text-xs">{repProfile.territory}</span>
            </div>
            <h1 className="text-2xl font-bold mt-1 text-white">Territory Performance</h1>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-extrabold text-emerald-400">{healthScore} <span className="text-xs text-slate-400">/ 100</span></div>
            <div className="text-xs text-slate-300 font-medium flex items-center justify-end space-x-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Health Index</span>
            </div>
          </div>
        </div>

        {/* Health Score Progress */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-medium text-slate-300">
            <span>Overall Territory Equilibrium</span>
            <span>{healthScore >= 80 ? 'Optimal' : healthScore >= 60 ? 'Moderate Risk' : 'Critical Gaps'}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                healthScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
        </div>

        {/* Territory Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-xs text-slate-400">Coverage Rate</div>
            <div className="text-lg font-bold text-white mt-0.5">{coverageRate}%</div>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-xs text-slate-400">Class A Frequency</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">{frequencyRate}%</div>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-xs text-slate-400">Unvisited Docs</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{missedDoctors.length}</div>
          </div>
        </div>
      </div>

      {/* Territory Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedTerritoryFilter('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            selectedTerritoryFilter === 'All'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Areas ({doctors.length})
        </button>
        {territories.map(t => {
          const count = doctors.filter(d => d.territory === t).length;
          return (
            <button
              key={t}
              onClick={() => setSelectedTerritoryFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedTerritoryFilter === t
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {/* Doctor Class Distribution & Coverage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Doctor Class Distribution */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-sm">Doctor Tier Tiering</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">{totalDoctors} Total Physicians</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <span>Class A (High Value)</span>
                </span>
                <span>{classA} ({Math.round((classA/totalDoctors)*100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(classA/totalDoctors)*100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Class B (Moderate Value)</span>
                </span>
                <span>{classB} ({Math.round((classB/totalDoctors)*100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(classB/totalDoctors)*100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span>Class C (Maintenance)</span>
                </span>
                <span>{classC} ({Math.round((classC/totalDoctors)*100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(classC/totalDoctors)*100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage by Area */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-sm">Sector Coverage Index</h2>
            </div>
            <span className="text-xs text-emerald-600 font-semibold">+6.4% MoM</span>
          </div>

          <div className="space-y-3">
            {territories.map(ter => {
              const terDocs = doctors.filter(d => d.territory === ter);
              const visited = terDocs.filter(d => d.totalVisitsThisMonth > 0).length;
              const rate = terDocs.length ? Math.round((visited / terDocs.length) * 100) : 0;
              return (
                <div key={ter}>
                  <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                    <span>{ter}</span>
                    <span className="font-semibold text-slate-800">{rate}% ({visited}/{terDocs.length})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${rate >= 75 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Territory Heat Map Simulation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Interactive Territory Density Heat Map</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Visual representation of doctor concentration & visit intensity</p>
          </div>
          <span className="text-xs bg-rose-50 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-200">
            GPS Synchronized
          </span>
        </div>

        <div className="relative w-full h-48 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-3">
          {/* Grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px]"></div>
          
          {/* Heat map glows */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl"></div>

          {/* Doctor Nodes */}
          {doctors.map((doc) => {
            const isVisited = doc.totalVisitsThisMonth > 0;
            return (
              <div 
                key={doc.id}
                className={`absolute group cursor-pointer transition-transform hover:scale-125 z-10`}
                style={{
                  top: `${Math.max(10, Math.min(85, doc.coordinate.y))}%`,
                  left: `${Math.max(10, Math.min(85, doc.coordinate.x))}%`
                }}
                onClick={() => quickNavigateToRecordVisitWithDoctor(doc)}
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  doc.doctorClass === 'Class A' ? 'bg-indigo-500 animate-pulse' : isVisited ? 'bg-emerald-500' : 'bg-rose-500'
                }`}></div>
                
                {/* Tooltip on hover */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-slate-800 text-white text-[10px] p-2 rounded-lg shadow-xl border border-slate-700 z-20 pointer-events-none whitespace-normal">
                  <div className="font-bold text-white">{doc.name}</div>
                  <div className="text-slate-300">{doc.specialty} • {doc.doctorClass}</div>
                  <div className="text-indigo-300 font-semibold mt-0.5">{doc.hospital}</div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] text-slate-300 flex items-center space-x-3">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span><span>Class A</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Visited</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span>Overdue</span></span>
          </div>
        </div>
      </div>

      {/* Missed / Overdue Doctors Action List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-slate-800 text-sm">High Priority Unvisited Doctors</h2>
          </div>
          <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full">
            {missedDoctors.length} Require Action
          </span>
        </div>

        {missedDoctors.length === 0 ? (
          <div className="p-4 bg-emerald-50 rounded-xl text-center text-emerald-800 text-xs font-semibold">
            🎉 Excellent! All physicians in your territory have been visited this month.
          </div>
        ) : (
          <div className="space-y-2.5">
            {missedDoctors.map((doc) => (
              <div 
                key={doc.id} 
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between hover:border-indigo-300 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 text-sm">{doc.name}</span>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">
                      {doc.doctorClass}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {doc.specialty} • {doc.hospital} ({doc.territory})
                  </div>
                </div>

                <button
                  onClick={() => quickNavigateToRecordVisitWithDoctor(doc)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm flex items-center space-x-1 transition-colors"
                >
                  <span>Record Visit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
