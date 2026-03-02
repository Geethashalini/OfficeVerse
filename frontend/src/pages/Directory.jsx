import { useState, useEffect } from 'react';
import { Users, Search, X, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { employeesAPI } from '../services/api';
import toast from 'react-hot-toast';

function EmployeeCard({ employee, onClick }) {
  return (
    <div
      onClick={() => onClick(employee)}
      className="glass-card p-5 hover:border-white/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary-500/5 group"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg"
            style={{ background: employee.coverColor, boxShadow: `0 4px 20px ${employee.coverColor}40` }}
          >
            {employee.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1a1833]"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold group-hover:text-primary-300 transition-colors truncate">
            {employee.name}
          </h3>
          <p className="text-white/50 text-sm truncate">{employee.role}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className="badge text-xs"
              style={{
                background: `${employee.coverColor}15`,
                color: employee.coverColor,
                border: `1px solid ${employee.coverColor}25`
              }}
            >
              {employee.department}
            </span>
            <span className="text-white/25 text-xs flex items-center gap-1">
              <MapPin size={10} /> {employee.location}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {employee.skills.slice(0, 3).map(skill => (
          <span key={skill} className="badge bg-white/4 text-white/40 border border-white/8 text-xs">
            {skill}
          </span>
        ))}
        {employee.skills.length > 3 && (
          <span className="badge bg-white/4 text-white/30 border border-white/8 text-xs">
            +{employee.skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-white/25 text-xs">{employee.yearsAtCompany}yr at company</span>
        <span className="text-primary-400 text-xs font-medium">{employee.points} pts</span>
      </div>
    </div>
  );
}

function EmployeeModal({ employee, onClose }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="glass-card max-w-md w-full animate-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-24" style={{ background: `linear-gradient(135deg, ${employee.coverColor}40, ${employee.coverColor}10)` }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 30% 50%, ${employee.coverColor} 0%, transparent 60%)` }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/20 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end justify-between">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-xl border-4 border-[#1a1833]"
              style={{ background: employee.coverColor }}
            >
              {employee.avatar}
            </div>
            <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 mb-1">Active</span>
          </div>

          <h2 className="text-white text-xl font-bold">{employee.name}</h2>
          <p className="text-white/50 text-sm mt-0.5">{employee.role}</p>

          {employee.bio && (
            <p className="text-white/50 text-sm mt-3 leading-relaxed italic">"{employee.bio}"</p>
          )}

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3 text-sm">
              <Briefcase size={15} className="text-white/30 flex-shrink-0" />
              <span className="text-white/60">{employee.department} · {employee.yearsAtCompany} years</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={15} className="text-white/30 flex-shrink-0" />
              <span className="text-white/60">{employee.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={15} className="text-white/30 flex-shrink-0" />
              <span className="text-white/60">{employee.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={15} className="text-white/30 flex-shrink-0" />
              <span className="text-white/60">{employee.location}</span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map(skill => (
                <span
                  key={skill}
                  className="badge px-3 py-1 text-xs font-medium"
                  style={{
                    background: `${employee.coverColor}15`,
                    color: employee.coverColor,
                    border: `1px solid ${employee.coverColor}25`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="text-center">
              <p className="text-white font-bold">{employee.points}</p>
              <p className="text-white/30 text-xs">Points</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold">{employee.achievements.length}</p>
              <p className="text-white/30 text-xs">Awards</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold">{employee.yearsAtCompany}</p>
              <p className="text-white/30 text-xs">Years</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Directory() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState(['all']);
  const [activeDept, setActiveDept] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeDept !== 'all') params.department = activeDept;
      if (search) params.search = search;

      const [empData, deptData] = await Promise.all([
        employeesAPI.getAll(params),
        employeesAPI.getDepartments(),
      ]);
      setEmployees(empData);
      setDepartments(['all', ...deptData]);
    } catch {
      toast.error('Failed to load directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeDept]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Users size={24} className="text-blue-400" />
            Employee Directory
          </h1>
          <p className="text-white/40 text-sm mt-1">{employees.length} colleagues across {departments.length - 1} departments</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search by name, role, skill, or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-11 py-3"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              activeDept === dept
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/5'
            }`}
          >
            {dept === 'all' ? 'All Departments' : dept}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(emp => (
              <EmployeeCard key={emp.id} employee={emp} onClick={setSelected} />
            ))}
          </div>

          {employees.length === 0 && (
            <div className="text-center py-16">
              <Users size={40} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/30">No employees found.</p>
            </div>
          )}
        </>
      )}

      <EmployeeModal employee={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
