
import { useState, useMemo, useCallback } from 'react';
import { Calendar, Users, Check, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Scout, PresenceRecord } from '@/types';
import { mockScouts } from '@/data/mockScouts';

// Constants
const MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const WEEKLY_SESSION_DAYS = [5, 12, 19, 26];
const ATTENDANCE_PROBABILITY = 0.8;

// Types
interface MonthlyStats {
  totalSessions: number;
  attendanceRate: number;
  presentCount: number;
  totalPossibleAttendance: number;
}

// Utility functions
const generateSessionDates = (year: number, month: number): string[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  return WEEKLY_SESSION_DAYS
    .filter(day => day <= daysInMonth)
    .map(day => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
};

const generateMockPresenceRecords = (scouts: Scout[], year: number, month: number): PresenceRecord[] => {
  const sessionDates = generateSessionDates(year, month);
  const records: PresenceRecord[] = [];
  
  sessionDates.forEach(date => {
    scouts.forEach(scout => {
      const isPresent = Math.random() < ATTENDANCE_PROBABILITY;
      records.push({
        scoutId: scout.id,
        date,
        isPresent
      });
    });
  });
  
  return records;
};

const formatDateForDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit' });
};

// PDF Export functionality
const generatePDFContent = (
  scouts: Scout[],
  sessionDates: string[],
  getPresenceForDate: (scoutId: number, date: string) => boolean,
  monthlyStats: MonthlyStats,
  currentMonth: number,
  currentYear: number
): string => {
  const monthName = MONTH_NAMES[currentMonth];
  
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>كشف الحضور - ${monthName} ${currentYear}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          direction: rtl;
          text-align: right;
          margin: 20px;
          font-size: 12px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #22c55e;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #22c55e;
          margin: 0;
          font-size: 24px;
        }
        .header h2 {
          color: #666;
          margin: 5px 0;
          font-size: 18px;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #22c55e;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #22c55e;
          color: white;
          font-weight: bold;
        }
        .name-cell {
          text-align: right;
          font-weight: bold;
          max-width: 120px;
        }
        .present {
          background-color: #dcfce7;
          color: #16a34a;
          font-weight: bold;
        }
        .absent {
          background-color: #fef2f2;
          color: #dc2626;
          font-weight: bold;
        }
        .attendance-rate {
          font-weight: bold;
        }
        .good-attendance { color: #16a34a; }
        .medium-attendance { color: #eab308; }
        .poor-attendance { color: #dc2626; }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏕️ كشف الحضور الشهري</h1>
        <h2>${monthName} ${currentYear}</h2>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">${monthlyStats.totalSessions}</div>
          <div class="stat-label">عدد الجلسات</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${monthlyStats.attendanceRate}%</div>
          <div class="stat-label">معدل الحضور العام</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${monthlyStats.presentCount}</div>
          <div class="stat-label">إجمالي الحضور</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${scouts.length}</div>
          <div class="stat-label">عدد الكشافة</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>العمر</th>
            ${sessionDates.map(date => `<th>${formatDateForDisplay(date)}</th>`).join('')}
            <th>الإجمالي</th>
            <th>النسبة</th>
          </tr>
        </thead>
        <tbody>
          ${scouts.map(scout => {
            const scoutPresence = sessionDates.map(date => getPresenceForDate(scout.id, date));
            const totalPresent = scoutPresence.filter(Boolean).length;
            const attendanceRate = sessionDates.length > 0 
              ? Math.round((totalPresent / sessionDates.length) * 100) 
              : 0;
            
            const rateClass = attendanceRate >= 80 ? 'good-attendance' : 
                             attendanceRate >= 60 ? 'medium-attendance' : 'poor-attendance';
            
            return `
              <tr>
                <td class="name-cell">${scout.name}</td>
                <td>${scout.age}</td>
                ${sessionDates.map(date => {
                  const isPresent = getPresenceForDate(scout.id, date);
                  return `<td class="${isPresent ? 'present' : 'absent'}">${isPresent ? '✓' : '✗'}</td>`;
                }).join('')}
                <td><strong>${totalPresent}/${sessionDates.length}</strong></td>
                <td class="attendance-rate ${rateClass}">${attendanceRate}%</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>تم إنشاء هذا التقرير في ${new Date().toLocaleDateString('ar-EG')} - نظام إدارة الكشافة</p>
      </div>
    </body>
    </html>
  `;
  
  return htmlContent;
};

const exportToPDF = async (
  scouts: Scout[],
  sessionDates: string[],
  getPresenceForDate: (scoutId: number, date: string) => boolean,
  monthlyStats: MonthlyStats,
  currentMonth: number,
  currentYear: number
) => {
  try {
    const htmlContent = generatePDFContent(
      scouts,
      sessionDates,
      getPresenceForDate,
      monthlyStats,
      currentMonth,
      currentYear
    );
    
    // Create a new window with the HTML content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups.');
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing (optional)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

// Custom hooks
const usePresenceManager = (scouts: Scout[]) => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [presenceRecords, setPresenceRecords] = useState<PresenceRecord[]>(
    () => generateMockPresenceRecords(scouts, new Date().getFullYear(), new Date().getMonth())
  );

  const sessionDates = useMemo(() => 
    generateSessionDates(currentYear, currentMonth), 
    [currentYear, currentMonth]
  );

  const togglePresence = useCallback((scoutId: number, date: string) => {
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
        { scoutId, date, isPresent: true }
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

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setPresenceRecords(generateMockPresenceRecords(scouts, newYear, newMonth));
  }, [currentMonth, currentYear, scouts]);

  const monthlyStats = useMemo((): MonthlyStats => {
    const totalSessions = sessionDates.length;
    const presentCount = presenceRecords.filter(r => 
      sessionDates.includes(r.date) && r.isPresent
    ).length;
    const totalPossibleAttendance = totalSessions * scouts.length;
    const attendanceRate = totalPossibleAttendance > 0 
      ? Math.round((presentCount / totalPossibleAttendance) * 100) 
      : 0;

    return {
      totalSessions,
      attendanceRate,
      presentCount,
      totalPossibleAttendance
    };
  }, [presenceRecords, sessionDates, scouts.length]);

  const exportToPDFHandler = useCallback(async () => {
    try {
      await exportToPDF(
        scouts,
        sessionDates,
        getPresenceForDate,
        monthlyStats,
        currentMonth,
        currentYear
      );
      toast({
        title: "تم تصدير ملف PDF",
        description: "تم إنشاء ملف PDF للطباعة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير ملف PDF. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }, [scouts, sessionDates, getPresenceForDate, monthlyStats, currentMonth, currentYear, toast]);

  return {
    currentMonth,
    currentYear,
    sessionDates,
    monthlyStats,
    togglePresence,
    getPresenceForDate,
    navigateMonth,
    exportToPDF: exportToPDFHandler
  };
};

// Components
const AttendanceButton: React.FC<{
  isPresent: boolean;
  onClick: () => void;
}> = ({ isPresent, onClick }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
      isPresent
        ? 'bg-green-100 text-green-700 hover:bg-green-200'
        : 'bg-red-100 text-red-700 hover:bg-red-200'
    }`}
  >
    {isPresent ? <Check size={16} /> : <X size={16} />}
  </button>
);

const AttendanceRateBadge: React.FC<{ rate: number }> = ({ rate }) => (
  <span className={`px-2 py-1 rounded text-sm font-medium ${
    rate >= 80 ? 'bg-green-100 text-green-800' :
    rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'
  }`}>
    {rate}%
  </span>
);

const MonthNavigation: React.FC<{
  currentMonth: number;
  currentYear: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onExportPDF: () => void;
}> = ({ currentMonth, currentYear, onNavigate, onExportPDF }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-scout-green flex items-center">
      <Users className="ml-2" size={24} />
      كشف الحضور
    </h2>
    <div className="flex items-center space-x-4 space-x-reverse">
      <button
        onClick={onExportPDF}
        className="flex items-center px-4 py-2 bg-scout-green text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="ml-2" size={16} />
        تصدير PDF
      </button>
      <button
        onClick={() => onNavigate('prev')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronRight size={20} />
      </button>
      <h3 className="text-xl font-semibold">
        {MONTH_NAMES[currentMonth]} {currentYear}
      </h3>
      <button
        onClick={() => onNavigate('next')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  </div>
);

// Main component
const PresenceManager: React.FC = () => {
  const [scouts] = useState<Scout[]>(mockScouts);
  const {
    currentMonth,
    currentYear,
    sessionDates,
    monthlyStats,
    togglePresence,
    getPresenceForDate,
    navigateMonth,
    exportToPDF
  } = usePresenceManager(scouts);

  return (
    <div className="space-y-8">
      <div className="scout-card p-6">
        <MonthNavigation
          currentMonth={currentMonth}
          currentYear={currentYear}
          onNavigate={navigateMonth}
          onExportPDF={exportToPDF}
        />
        
        {/* Excel-style Presence Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right font-bold bg-scout-green text-white sticky left-0">الاسم</TableHead>
                <TableHead className="text-center font-bold bg-scout-green text-white">العمر</TableHead>
                {sessionDates.map(date => (
                  <TableHead key={date} className="text-center font-bold min-w-[100px] bg-scout-green text-white">
                    {formatDateForDisplay(date)}
                  </TableHead>
                ))}
                <TableHead className="text-center font-bold bg-scout-green text-white">الإجمالي</TableHead>
                <TableHead className="text-center font-bold bg-scout-green text-white">النسبة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scouts.map((scout) => {
                const scoutPresence = sessionDates.map(date => getPresenceForDate(scout.id, date));
                const totalPresent = scoutPresence.filter(Boolean).length;
                const attendanceRate = sessionDates.length > 0 
                  ? Math.round((totalPresent / sessionDates.length) * 100) 
                  : 0;
                
                return (
                  <TableRow key={scout.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium sticky left-0 bg-white">{scout.name}</TableCell>
                    <TableCell className="text-center">{scout.age}</TableCell>
                    {sessionDates.map(date => (
                      <TableCell key={date} className="text-center">
                        <AttendanceButton
                          isPresent={getPresenceForDate(scout.id, date)}
                          onClick={() => togglePresence(scout.id, date)}
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold">
                      {totalPresent}/{sessionDates.length}
                    </TableCell>
                    <TableCell className="text-center">
                      <AttendanceRateBadge rate={attendanceRate} />
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
          إحصائيات الشهر - {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-scout-green mb-1">{monthlyStats.totalSessions}</div>
            <div className="text-gray-600 text-sm">عدد الجلسات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{monthlyStats.attendanceRate}%</div>
            <div className="text-gray-600 text-sm">معدل الحضور</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{monthlyStats.presentCount}</div>
            <div className="text-gray-600 text-sm">إجمالي الحضور</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">{scouts.length}</div>
            <div className="text-gray-600 text-sm">عدد الكشافة</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceManager;
