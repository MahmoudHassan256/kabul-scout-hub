
import { useState } from 'react';
import { Calendar, Users, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Scout, PresenceRecord, CustomColumn } from '@/types';
import { mockScouts } from '@/data/mockScouts';
import CustomColumnManager from './CustomColumnManager';

const PresenceManager = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [scouts] = useState<Scout[]>(mockScouts);

  // Generate mock presence records for the current month
  const generateMockPresenceRecords = (): PresenceRecord[] => {
    const records: PresenceRecord[] = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const sessionsPerMonth = [5, 12, 19, 26]; // Weekly sessions on specific days
    
    sessionsPerMonth.forEach(day => {
      if (day <= daysInMonth) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        scouts.forEach(scout => {
          // Random attendance with 80% probability of being present
          const isPresent = Math.random() > 0.2;
          records.push({
            scoutId: scout.id,
            date: dateStr,
            isPresent
          });
        });
      }
    });
    
    return records;
  };

  const [presenceRecords, setPresenceRecords] = useState<PresenceRecord[]>(generateMockPresenceRecords());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const togglePresence = (scoutId: number) => {
    const existingRecord = presenceRecords.find(
      record => record.scoutId === scoutId && record.date === date
    );

    if (existingRecord) {
      setPresenceRecords(prev =>
        prev.map(record =>
          record.scoutId === scoutId && record.date === date
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

    const scout = scouts.find(s => s.id === scoutId);
    toast({
      title: "تم تحديث الحضور",
      description: `تم تحديث حضور ${scout?.name}`,
    });
  }, [presenceRecords, scouts, toast]);

  const getPresenceForDate = useCallback((scoutId: number, date: string): boolean => {
    const record = presenceRecords.find(r => r.scoutId === scoutId && r.date === date);
    return record?.isPresent ?? false;
  }, [presenceRecords]);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === 'prev') {
      if (currentMonth === 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    } else {
      if (currentMonth === 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    }
    // Regenerate presence records for the new month
    setPresenceRecords(generateMockPresenceRecords());
  };

  // Get all session dates for the current month
  const getSessionDates = () => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    const sessionDates = new Set(
      presenceRecords
        .filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= monthStart && recordDate <= monthEnd;
        })
        .map(r => r.date)
    );
    
    return Array.from(sessionDates).sort();
  };

  const stats = getMonthlyStats();
  const sessionDates = getSessionDates();

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

        {/* Excel-style Presence Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right font-bold">الاسم</TableHead>
                <TableHead className="text-right font-bold">المجموعة</TableHead>
                <TableHead className="text-right font-bold">العمر</TableHead>
                {sessionDates.map(date => (
                  <TableHead key={date} className="text-center font-bold min-w-[100px]">
                    {new Date(date).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit' })}
                  </TableHead>
                ))}
                <TableHead className="text-center font-bold">الإجمالي</TableHead>
                <TableHead className="text-center font-bold">النسبة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scouts.map((scout) => {
                const scoutPresence = sessionDates.map(date => getPresenceForDate(scout.id, date));
                const totalPresent = scoutPresence.filter(Boolean).length;
                const attendanceRate = sessionDates.length > 0 ? Math.round((totalPresent / sessionDates.length) * 100) : 0;
                
                return (
                  <TableRow key={scout.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{scout.name}</TableCell>
                    <TableCell>{scout.group}</TableCell>
                    <TableCell>{scout.age}</TableCell>
                    {sessionDates.map(date => {
                      const isPresent = getPresenceForDate(scout.id, date);
                      return (
                        <TableCell key={date} className="text-center">
                          <button
                            onClick={() => {
                              setSelectedDate(date);
                              togglePresence(scout.id);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isPresent
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {isPresent ? <Check size={16} /> : <X size={16} />}
                          </button>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-semibold">
                      {totalPresent}/{sessionDates.length}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        attendanceRate >= 80 ? 'bg-green-100 text-green-800' :
                        attendanceRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {attendanceRate}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
        <MonthNavigation
          currentMonth={currentMonth}
          currentYear={currentYear}
          onNavigate={navigateMonth}
          onExportPDF={exportToPDF}
        />
        <PresenceTable
          scouts={scouts}
          sessionDates={sessionDates}
          getPresenceForDate={getPresenceForDate}
          togglePresence={togglePresence}
        />
      </div>

      <MonthlyStatsSection
        stats={monthlyStats}
        scoutCount={scouts.length}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  );
};

export default PresenceManager;