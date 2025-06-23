// PresenceManager.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, Users, Check, X, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const MONTH_NAMES = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
const ages = [
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "ما فوق الثانوية",
];

const generateSessionDates = (year: number, month: number): string[] => {
  const dates: string[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() === 6) {
      // Saturday local time
      dates.push(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      );
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const formatDateForDisplay = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

const sortScoutsByClass = (scoutsArray: Tables<"scouts">[]) => {
  return scoutsArray.sort((a, b) => {
    const indexA = ages.indexOf(a.class);
    const indexB = ages.indexOf(b.class);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
};

const generatePDFContent = (
  scouts: Tables<"scouts">[],
  sessionDates: string[],
  getPresence: (scoutId: string, date: string) => boolean,
  totalSessions: number,
  attendanceRate: number,
  totalPresent: number,
  year: number,
  month: number
): string => {
  const monthName = MONTH_NAMES[month];
  return `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>كشف الحضور</title>
  <style>body { font-family: Arial; direction: rtl; padding: 20px; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
  th { background: #16a34a; color: white; }</style></head><body>
  <h1>كشف حضور - ${monthName} ${year}</h1>
  <p>عدد الجلسات: ${totalSessions}</p>
  <p>معدل الحضور: ${attendanceRate}%</p>
  <p>إجمالي الحضور: ${totalPresent}</p>
  <table><thead><tr><th>الاسم</th><th>الصف</th>${sessionDates
    .map((d) => `<th>${formatDateForDisplay(d)}</th>`)
    .join("")}<th>الإجمالي</th><th>النسبة</th></tr></thead><tbody>
  ${scouts
    .map((s) => {
      const presences = sessionDates.map((date) => getPresence(s.id, date));
      const total = presences.filter(Boolean).length;
      const rate = totalSessions
        ? Math.round((total / totalSessions) * 100)
        : 0;
      return `<tr><td>${s.fullName}</td><td>${s.class}</td>${presences
        .map((p) => `<td>${p ? "✓" : "✗"}</td>`)
        .join("")}<td>${total}/${totalSessions}</td><td>${rate}%</td></tr>`;
    })
    .join("")}</tbody></table></body></html>`;
};

const AttendanceButton = ({
  isPresent,
  onClick,
}: {
  isPresent: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
      isPresent
        ? "bg-green-100 text-green-700 hover:bg-green-200"
        : "bg-red-100 text-red-700 hover:bg-red-200"
    }`}
  >
    {isPresent ? <Check size={16} /> : <X size={16} />}
  </button>
);

const AttendanceRateBadge = ({ rate }: { rate: number }) => (
  <span
    className={`px-2 py-1 rounded text-sm font-medium ${
      rate >= 80
        ? "bg-green-100 text-green-800"
        : rate >= 60
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {rate}%
  </span>
);

const PresenceManager = () => {
  const { toast } = useToast();
  const [scouts, setScouts] = useState<Tables<"scouts">[]>([]);
  const [presenceRecords, setPresenceRecords] = useState<
    Tables<"presence_records">[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const sessionDates = useMemo(
    () => generateSessionDates(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const loadScouts = async () => {
    const { data, error } = await supabase.from("scouts").select("*");
    if (!error && data) setScouts(sortScoutsByClass(data));
  };

  const loadPresence = async () => {
    const from = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-01`;
    const to = `${selectedYear}-${String(selectedMonth + 2).padStart(
      2,
      "0"
    )}-01`;
    const { data, error } = await supabase
      .from("presence_records")
      .select("*")
      .gte("date", from)
      .lt("date", to);
    if (!error && data) setPresenceRecords(data);
  };

  useEffect(() => {
    loadScouts();
  }, []);

  useEffect(() => {
    loadPresence();
  }, [selectedMonth, selectedYear]);

  const getPresence = useCallback(
    (scoutId: string, date: string): boolean => {
      return presenceRecords.some(
        (r) => r.scoutId === scoutId && r.date === date && r.isPresent
      );
    },
    [presenceRecords]
  );

  const togglePresence = async (scoutId: string, date: string) => {
    const record = presenceRecords.find(
      (r) => r.scoutId === scoutId && r.date === date
    );
    if (record) {
      const { error } = await supabase
        .from("presence_records")
        .update({ isPresent: !record.isPresent })
        .eq("id", record.id);
      if (!error) {
        setPresenceRecords((prev) =>
          prev.map((r) =>
            r.id === record.id ? { ...r, isPresent: !r.isPresent } : r
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from("presence_records")
        .insert({ scoutId, date, isPresent: true })
        .select();
      if (!error && data) {
        setPresenceRecords((prev) => [...prev, data[0]]);
      }
    }

    const scout = scouts.find((s) => s.id === scoutId);
    toast({
      title: "تم تحديث الحضور",
      description: `تم تحديث حضور ${scout?.fullName}`,
    });
  };

  const totalSessions = sessionDates.length;
  const totalPossible = totalSessions * scouts.length;
  const totalPresent = presenceRecords.filter(
    (r) => sessionDates.includes(r.date) && r.isPresent
  ).length;
  const attendanceRate =
    totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;

  const handleExportPDF = () => {
    const html = generatePDFContent(
      scouts,
      sessionDates,
      getPresence,
      totalSessions,
      attendanceRate,
      totalPresent,
      selectedYear,
      selectedMonth
    );
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleSort = () => {
    setScouts(sortScoutsByClass([...scouts]));
  };
  useEffect(() => {
    loadScouts();
    const interval = setInterval(loadScouts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadPresence();
    const interval = setInterval(loadPresence, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [selectedMonth, selectedYear]);
  return (
    <div className="space-y-8">
      <div className="scout-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-scout-green flex items-center">
            <Users className="ml-2" size={24} /> كشف الحضور
          </h2>
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="rounded-lg px-2 py-1 bg-scout-green text-white text-center"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={i} value={i}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(parseInt(e.target.value));
              }}
              className="rounded-lg px-2 py-1 bg-scout-green text-white text-center w-[80px]"
            />
            {("" + selectedYear).length == 4 && (
              <button
                onClick={handleExportPDF}
                className="flex items-center px-4 py-2 bg-scout-green text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="ml-2" size={16} /> PDF
              </button>
            )}
          </div>
        </div>
        {("" + selectedYear).length == 4 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right font-bold bg-scout-green text-white sticky left-0">
                    الاسم
                  </TableHead>
                  <TableHead className="text-center font-bold bg-scout-green text-white">
                    الصف
                  </TableHead>
                  {sessionDates.map((date) => (
                    <TableHead
                      key={date}
                      className="text-right font-bold min-w-[100px] bg-scout-green text-white"
                    >
                      {formatDateForDisplay(date)}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold bg-scout-green text-white">
                    الإجمالي
                  </TableHead>
                  <TableHead className="text-center font-bold bg-scout-green text-white">
                    النسبة
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scouts.map((scout) => {
                  const scoutPresence = sessionDates.map((date) =>
                    getPresence(scout.id, date)
                  );
                  const presentCount = scoutPresence.filter(Boolean).length;
                  const rate =
                    totalSessions > 0
                      ? Math.round((presentCount / totalSessions) * 100)
                      : 0;

                  return (
                    <TableRow key={scout.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium sticky left-0 bg-white">
                        {scout.fullName}
                      </TableCell>
                      <TableCell className="text-center">
                        {scout.class}
                      </TableCell>
                      {sessionDates.map((date) => (
                        <TableCell key={date} className="text-center">
                          <AttendanceButton
                            isPresent={getPresence(scout.id, date)}
                            onClick={() => togglePresence(scout.id, date)}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold">
                        {presentCount}/{totalSessions}
                      </TableCell>
                      <TableCell className="text-center">
                        <AttendanceRateBadge rate={rate} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {("" + selectedYear).length == 4 && (
        <div className="scout-card p-6">
          <h3 className="text-xl font-bold text-scout-green mb-6 flex items-center">
            <Calendar className="ml-2" size={20} /> إحصائيات الشهر -{" "}
            {MONTH_NAMES[selectedMonth]} {selectedYear}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-scout-green mb-1">
                {totalSessions}
              </div>
              <div className="text-gray-600 text-sm">عدد الجلسات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {attendanceRate}%
              </div>
              <div className="text-gray-600 text-sm">معدل الحضور</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {totalPresent}
              </div>
              <div className="text-gray-600 text-sm">إجمالي الحضور</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {scouts.length}
              </div>
              <div className="text-gray-600 text-sm">عدد الكشافة</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresenceManager;
