
import { useState } from 'react';
import { Calendar, Users, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Scout {
  id: number;
  name: string;
  group: string;
}

interface PresenceRecord {
  scoutId: number;
  date: string;
  isPresent: boolean;
}

const PresenceManager = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Sample scouts data
  const [scouts] = useState<Scout[]>([
    { id: 1, name: 'أحمد محمد', group: 'الأشبال' },
    { id: 2, name: 'فاطمة علي', group: 'الزهرات' },
    { id: 3, name: 'يوسف أحمد', group: 'الكشافة' },
    { id: 4, name: 'زينب حسن', group: 'المرشدات' },
    { id: 5, name: 'محمد عبدالله', group: 'الجوالة' },
    { id: 6, name: 'سارة محمود', group: 'الدليلات' },
    { id: 7, name: 'عمر خالد', group: 'الأشبال' },
    { id: 8, name: 'نور الدين', group: 'الكشافة' },
  ]);

  // Sample presence records
  const [presenceRecords, setPresenceRecords] = useState<PresenceRecord[]>([
    { scoutId: 1, date: '2024-06-15', isPresent: true },
    { scoutId: 2, date: '2024-06-15', isPresent: true },
    { scoutId: 3, date: '2024-06-15', isPresent: false },
    { scoutId: 4, date: '2024-06-15', isPresent: true },
    { scoutId: 5, date: '2024-06-15', isPresent: true },
    { scoutId: 6, date: '2024-06-15', isPresent: false },
    { scoutId: 7, date: '2024-06-15', isPresent: true },
    { scoutId: 8, date: '2024-06-15', isPresent: true },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const togglePresence = (scoutId: number) => {
    const existingRecord = presenceRecords.find(
      record => record.scoutId === scoutId && record.date === selectedDate
    );

    if (existingRecord) {
      setPresenceRecords(prev =>
        prev.map(record =>
          record.scoutId === scoutId && record.date === selectedDate
            ? { ...record, isPresent: !record.isPresent }
            : record
        )
      );
    } else {
      setPresenceRecords(prev => [
        ...prev,
        { scoutId, date: selectedDate, isPresent: true }
      ]);
    }

    toast({
      title: "تم تحديث الحضور",
      description: `تم تحديث حضور ${scouts.find(s => s.id === scoutId)?.name}`,
    });
  };

  const getPresenceForDate = (scoutId: number, date: string) => {
    const record = presenceRecords.find(
      r => r.scoutId === scoutId && r.date === date
    );
    return record?.isPresent ?? false;
  };

  const getMonthlyStats = () => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    const monthRecords = presenceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    const totalSessions = new Set(monthRecords.map(r => r.date)).size;
    const presentCount = monthRecords.filter(r => r.isPresent).length;
    const totalPossibleAttendance = totalSessions * scouts.length;
    const attendanceRate = totalPossibleAttendance > 0 ? (presentCount / totalPossibleAttendance) * 100 : 0;

    return {
      totalSessions,
      attendanceRate: Math.round(attendanceRate),
      presentCount,
      totalPossibleAttendance
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const stats = getMonthlyStats();

  return (
    <div className="space-y-8">
      {/* Month Navigation */}
      <div className="scout-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-scout-green flex items-center">
            <Users className="ml-2" size={24} />
            كشف الحضور
          </h2>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
            <h3 className="text-xl font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختر تاريخ الجلسة:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
          />
        </div>

        {/* Scouts Presence List */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            حضور الكشافة - {new Date(selectedDate).toLocaleDateString('ar-EG')}
          </h4>
          {scouts.map((scout) => {
            const isPresent = getPresenceForDate(scout.id, selectedDate);
            return (
              <div
                key={scout.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h5 className="font-medium text-gray-900">{scout.name}</h5>
                    <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {scout.group}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => togglePresence(scout.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                    isPresent
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {isPresent ? <Check size={16} /> : <X size={16} />}
                  <span>{isPresent ? 'حاضر' : 'غائب'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="scout-card p-6">
        <h3 className="text-xl font-bold text-scout-green mb-6 flex items-center">
          <Calendar className="ml-2" size={20} />
          إحصائيات الشهر - {monthNames[currentMonth]} {currentYear}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-scout-green mb-1">{stats.totalSessions}</div>
            <div className="text-gray-600 text-sm">عدد الجلسات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.attendanceRate}%</div>
            <div className="text-gray-600 text-sm">معدل الحضور</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.presentCount}</div>
            <div className="text-gray-600 text-sm">إجمالي الحضور</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">{scouts.length}</div>
            <div className="text-gray-600 text-sm">عدد الكشافة</div>
          </div>
        </div>
      </div>

      {/* Scout Groups Summary */}
      <div className="scout-card p-6">
        <h3 className="text-xl font-bold text-scout-green mb-6">ملخص المجموعات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(scouts.map(s => s.group))).map((group) => {
            const groupScouts = scouts.filter(s => s.group === group);
            const groupPresence = groupScouts.filter(scout => 
              getPresenceForDate(scout.id, selectedDate)
            ).length;
            
            return (
              <div key={group} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">{group}</h4>
                <div className="text-sm text-gray-600">
                  الحضور: {groupPresence} من {groupScouts.length}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-scout-green h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${groupScouts.length > 0 ? (groupPresence / groupScouts.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PresenceManager;
