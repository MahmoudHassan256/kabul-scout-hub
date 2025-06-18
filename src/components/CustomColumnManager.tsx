import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CustomColumn } from '@/types';

interface CustomColumnManagerProps {
  customColumns: CustomColumn[];
  onAddColumn: (column: CustomColumn) => void;
  onRemoveColumn: (columnId: string) => void;
}

const CustomColumnManager = ({ customColumns, onAddColumn, onRemoveColumn }: CustomColumnManagerProps) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColumn, setNewColumn] = useState({
    name: '',
    type: 'text' as const
  });

  const handleAddColumn = () => {
    if (!newColumn.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم العمود",
        variant: "destructive",
      });
      return;
    }

    const column: CustomColumn = {
      id: `custom_${Date.now()}`,
      name: newColumn.name,
      type: newColumn.type
    };

    onAddColumn(column);
    setNewColumn({ name: '', type: 'text' });
    setShowAddForm(false);
    
    toast({
      title: "تم إضافة العمود",
      description: `تم إضافة العمود "${newColumn.name}" بنجاح`,
    });
  };

  const handleRemoveColumn = (columnId: string, columnName: string) => {
    onRemoveColumn(columnId);
    toast({
      title: "تم حذف العمود",
      description: `تم حذف العمود "${columnName}" بنجاح`,
    });
  };

  return (
    <div className="scout-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-scout-green">إدارة الأعمدة المخصصة</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 space-x-reverse scout-btn-primary text-sm"
        >
          <Plus size={16} />
          <span>إضافة عمود</span>
        </button>
      </div>

      {/* Existing Custom Columns */}
      {customColumns.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">الأعمدة المخصصة الحالية:</h4>
          <div className="flex flex-wrap gap-2">
            {customColumns.map((column) => (
              <div key={column.id} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                <span className="text-sm">{column.name}</span>
                <span className="text-xs text-gray-500 ml-2">({column.type})</span>
                <button
                  onClick={() => handleRemoveColumn(column.id, column.name)}
                  className="mr-2 text-red-600 hover:text-red-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Column Form */}
      {showAddForm && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="اسم العمود"
              value={newColumn.name}
              onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
            />
            <select
              value={newColumn.type}
              onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
            >
              <option value="text">نص</option>
              <option value="number">رقم</option>
              <option value="boolean">صح/خطأ</option>
              <option value="date">تاريخ</option>
            </select>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={handleAddColumn}
                className="scout-btn-primary text-sm"
              >
                إضافة
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomColumnManager;
