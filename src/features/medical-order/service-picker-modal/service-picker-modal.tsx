"use client";

import * as React from "react";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_SERVICES, MockServiceItem } from "@/shared/constants/mock-data";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Search,
  X,
  Plus,
  Check,
  FlaskConical,
  Activity,
  Scan,
  Camera,
  Layers,
  Sparkles,
} from "lucide-react";

type CategoryFilter = "ALL" | "LAB" | "ECG" | "ULTRASOUND" | "XRAY" | "ENDOSCOPY";

export function ServicePickerModal() {
  const { isServicePickerOpen, closeServicePicker, targetRoundForAdd, orders, addOrder } =
    useWorkspaceStore();
  const { showToast } = useUIStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryFilter>("ALL");

  if (!isServicePickerOpen) return null;

  // Filter clinical services (exclude basic EXAM)
  const clinicalServices = MOCK_SERVICES.filter((s) => s.category !== "EXAM");

  const filteredServices = clinicalServices.filter((svc) => {
    const matchesCategory =
      selectedCategory === "ALL" || svc.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      svc.code.toLowerCase().includes(q) ||
      svc.name.toLowerCase().includes(q) ||
      svc.roomName.toLowerCase().includes(q) ||
      svc.roomCode.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleSelectService = (service: MockServiceItem) => {
    const success = addOrder(service, targetRoundForAdd);
    if (success) {
      showToast(
        `Đã thêm [${service.code}] ${service.name} vào Đợt ${targetRoundForAdd}.`
      );
    } else {
      showToast(`Dịch vụ này đã có trong Đợt ${targetRoundForAdd}!`);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "LAB":
        return <Badge variant="default" className="text-[10px]">Xét nghiệm</Badge>;
      case "ECG":
        return <Badge variant="purple" className="text-[10px]">Thăm dò ECG</Badge>;
      case "ULTRASOUND":
        return <Badge variant="success" className="text-[10px]">Siêu âm</Badge>;
      case "XRAY":
        return <Badge variant="warn" className="text-[10px]">X-Quang KTS</Badge>;
      case "ENDOSCOPY":
        return <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-300">Nội soi</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeServicePicker} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-700">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-clinic-blue" />
              <h2 className="text-base font-black text-white">
                Thêm chỉ định Cận lâm sàng — Đợt {targetRoundForAdd}
              </h2>
              <Badge variant="purple" className="text-[10px] font-bold">
                Round {targetRoundForAdd}
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              Tra cứu và chọn kỹ thuật xét nghiệm, thăm dò chức năng hoặc CĐHA từ danh mục phòng khám
            </p>
          </div>
          <button
            onClick={closeServicePicker}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã dịch vụ (LAB, ECG, US, XRAY...) hoặc tên kỹ thuật..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-clinic-blue focus:border-clinic-blue text-slate-900 placeholder:text-slate-400 font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Tất cả ({clinicalServices.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("LAB")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedCategory === "LAB"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <FlaskConical className="w-3 h-3" />
              Xét nghiệm máu
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("ECG")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedCategory === "ECG"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Activity className="w-3 h-3" />
              Điện tim (ECG)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("ULTRASOUND")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedCategory === "ULTRASOUND"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Scan className="w-3 h-3" />
              Siêu âm Doppler
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("XRAY")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedCategory === "XRAY"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Camera className="w-3 h-3" />
              X-Quang KTS
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("ENDOSCOPY")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedCategory === "ENDOSCOPY"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Layers className="w-3 h-3" />
              Nội soi
            </button>
          </div>
        </div>

        {/* Services List Scroll Area */}
        <div className="p-4 overflow-y-auto max-h-[55vh] divide-y divide-slate-100 space-y-2">
          {filteredServices.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-xs">Không tìm thấy kỹ thuật phù hợp</p>
              <p className="text-[11px]">Vui lòng thử tìm kiếm theo từ khóa khác hoặc chuyển nhóm dịch vụ</p>
            </div>
          ) : (
            filteredServices.map((service) => {
              const isAdded = orders.some(
                (o) => o.serviceCode === service.code && o.round === targetRoundForAdd
              );

              return (
                <div
                  key={service.code}
                  className={`pt-2.5 pb-2.5 px-3 rounded-xl flex items-start justify-between gap-3 transition-colors ${
                    isAdded ? "bg-blue-50/60 border border-blue-200" : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {service.code}
                      </span>
                      {getCategoryBadge(service.category)}
                      <h3 className="font-bold text-slate-900 text-xs">{service.name}</h3>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
                      <span>
                        Vị trí: <b className="text-clinic-blue font-bold">{service.roomName}</b> ({service.roomCode} — {service.floor})
                      </span>
                      {service.sampleType && (
                        <span className="text-purple-700 font-medium">
                          Mẫu: {service.sampleType}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 italic">
                      💡 Chuẩn bị: {service.preparationInstructions}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-mono font-black text-xs text-slate-900">
                      {formatCurrencyVND(service.price)}
                    </span>

                    {isAdded ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled
                        className="h-7 px-2.5 text-[11px] bg-blue-100 text-blue-800 font-bold border border-blue-300"
                      >
                        <Check className="w-3 h-3 mr-1 text-blue-700" />
                        Đã chọn
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleSelectService(service)}
                        className="h-7 px-3 text-[11px] font-bold shadow-sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Chọn chỉ định
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-600">
            Hiện có <b>{orders.filter((o) => o.round === targetRoundForAdd).length}</b> chỉ định trong Đợt {targetRoundForAdd}
          </div>
          <Button size="sm" variant="outline" onClick={closeServicePicker} className="font-bold">
            Hoàn tất & Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
