import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Users,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  FlaskConical,
  CreditCard,
  FileText,
  Building2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const kpis = [
    {
      label: "Bệnh nhân đã tiếp nhận",
      value: "142",
      sub: "Hôm nay",
      trend: "up",
      icon: Users,
      accentBorder: "border-l-blue-600",
      iconBg: "bg-blue-50 text-blue-700",
      badgeText: "Tiếp đón",
    },
    {
      label: "Chờ bác sĩ khám",
      value: "8",
      sub: "Chờ TB: 8 phút",
      trend: "neutral",
      icon: Clock,
      accentBorder: "border-l-amber-500",
      iconBg: "bg-amber-50 text-amber-800",
      badgeText: "Khám ban đầu",
    },
    {
      label: "Chờ thanh toán CLS",
      value: "5",
      sub: "Đang chờ tại quầy",
      trend: "neutral",
      icon: CreditCard,
      accentBorder: "border-l-orange-500",
      iconBg: "bg-orange-50 text-orange-700",
      badgeText: "Thu phí CLS",
    },
    {
      label: "Đang thực hiện CLS",
      value: "12",
      sub: "Lab P.202 & ECG P.208",
      trend: "neutral",
      icon: FlaskConical,
      accentBorder: "border-l-purple-600",
      iconBg: "bg-purple-50 text-purple-700",
      badgeText: "Đang xét nghiệm",
    },
    {
      label: "Chờ bác sĩ kết luận",
      value: "4",
      sub: "Đã có đủ kết quả",
      trend: "up",
      icon: Stethoscope,
      accentBorder: "border-l-indigo-600",
      iconBg: "bg-indigo-50 text-indigo-700",
      badgeText: "Ưu tiên cao",
    },
    {
      label: "Hoàn tất hôm nay",
      value: "113",
      sub: "Đạt 97.4% SLA",
      trend: "up",
      icon: CheckCircle2,
      accentBorder: "border-l-emerald-600",
      iconBg: "bg-emerald-50 text-emerald-800",
      badgeText: "Đóng hồ sơ",
    },
  ];

  const quickActions = [
    {
      label: "Tiếp nhận & Thu phí khám",
      sub: "Đăng ký hồ sơ & thu 150.000 đ",
      icon: Users,
      href: "/reception",
      color: "hover:border-blue-300 hover:bg-blue-50/40",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      label: "Danh sách chờ Bác sĩ",
      sub: "Khám lâm sàng & Kết luận ca bệnh",
      icon: Stethoscope,
      href: "/clinical",
      color: "hover:border-indigo-300 hover:bg-indigo-50/40",
      iconColor: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Thanh toán dịch vụ CLS",
      sub: "Thu phí đợt chỉ định & cấp quyền",
      icon: CreditCard,
      href: "/billing",
      color: "hover:border-emerald-300 hover:bg-emerald-50/40",
      iconColor: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Xét nghiệm trung tâm",
      sub: "P.202 • Nhận mẫu & duyệt kết quả",
      icon: FlaskConical,
      href: "/laboratory",
      color: "hover:border-purple-300 hover:bg-purple-50/40",
      iconColor: "text-purple-600 bg-purple-50",
    },
  ];

  const queues = [
    {
      roomCode: "P.203",
      room: "Khám Nội tổng quát",
      doctor: "BS. Lê Minh",
      waiting: 6,
      inExam: "Nguyễn Văn An (ENC-260919-041)",
      tat: "12p",
      status: "Bình thường",
      href: "/clinical",
      linkText: "Vào P.203",
    },
    {
      roomCode: "P.202",
      room: "Xét nghiệm trung tâm",
      doctor: "CNXN. Trần Thu Hà",
      waiting: 8,
      inExam: "3 mẫu đang chạy",
      tat: "25p",
      status: "Tải cao",
      href: "/laboratory",
      linkText: "Vào Lab P.202",
    },
    {
      roomCode: "P.208",
      room: "Thăm dò & Điện tim",
      doctor: "KTV. Vũ Tuấn",
      waiting: 3,
      inExam: "1 ca đang đo ECG",
      tat: "8p",
      status: "Bình thường",
      href: "/imaging",
      linkText: "Vào ECG P.208",
    },
    {
      roomCode: "P.105",
      room: "Siêu âm màu 01",
      doctor: "BS. Hoàng Ngọc",
      waiting: 5,
      inExam: "1 ca đang siêu âm",
      tat: "15p",
      status: "Bình thường",
      href: "/imaging",
      linkText: "Vào Siêu âm P.105",
    },
  ];

  const liveEvents = [
    {
      time: "10:14",
      title: "BN. Nguyễn Văn An (ENC-260919-041) hoàn tất 3/3 CLS",
      sub: "Tự động chuyển về: Chờ bác sĩ kết luận",
      type: "success",
    },
    {
      time: "10:08",
      title: "KTV P.208 duyệt kết quả Điện tâm đồ (ECG)",
      sub: "Nhịp xoang đều 78ck/p • Trả kết quả về phòng khám",
      type: "primary",
    },
    {
      time: "09:55",
      title: "Thanh toán CLS hoàn tất: 250.000 đ (VietQR)",
      sub: "Đã xác nhận & Cấp quyền thực hiện Lab/ECG",
      type: "neutral",
    },
    {
      time: "09:40",
      title: "Tiếp nhận mới & Thu phí khám 150.000 đ",
      sub: "BN. Trần Thị Mai • Phân luồng vào P.203 Nội khoa",
      type: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TỔNG QUAN VẬN HÀNH NGOẠI TRÚ"
        title="Dashboard Quản trị Phòng khám"
        description="Theo dõi lưu lượng bệnh nhân, tiến độ cận lâm sàng và luồng khám liên tục thời gian thực"
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Ca làm việc: Sáng 07:30 - 12:00
            </span>
            <Link href="/clinical">
              <Button className="font-bold bg-clinic-blue text-white shadow-sm hover:bg-clinic-blue-hover active:scale-[0.98]">
                Mở Danh sách chờ Bác sĩ
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* 6 Journey Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <Card
              key={i}
              className={`border-slate-200 border-l-4 ${k.accentBorder} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default bg-white`}
            >
              <CardContent className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 tracking-tight truncate">{k.label}</span>
                  <div className={`p-1.5 rounded-md ${k.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between pt-0.5">
                  <div className="text-xl font-black text-slate-900 tracking-tight font-mono">
                    {k.value}
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {k.badgeText}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5 flex items-center gap-1 truncate">
                  {k.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-700 shrink-0" />}
                  <span className="truncate">{k.sub}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Operations Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link key={idx} href={action.href} className="block group">
              <div
                className={`p-3 bg-white border border-slate-200 rounded-xl shadow-xs transition-all duration-200 flex items-center gap-3 ${action.color} group-hover:shadow-sm`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${action.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate group-hover:text-clinic-blue transition-colors">
                    {action.label}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate">{action.sub}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-clinic-blue group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* SLA Alert Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>CẢNH BÁO SLA TỰ ĐỘNG:</span>
              <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded font-mono text-[10px]">
                3 ca chạm ngưỡng 35p
              </span>
            </div>
            <div className="text-slate-700 mt-0.5 text-[11px] leading-relaxed">
              Phòng Xét nghiệm P.202 có 2 mẫu máu chờ quá 35 phút (SLA tối đa 45 phút). Hệ thống đã tự động gửi tín hiệu ưu tiên sang máy phân tích tự động.
            </div>
          </div>
        </div>
        <Link href="/laboratory" className="shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="border-amber-400 text-amber-900 bg-white hover:bg-amber-100/70 font-bold text-xs h-8 shadow-xs"
          >
            Xem hàng đợi Lab P.202 →
          </Button>
        </Link>
      </div>

      {/* Main Command Center: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Real-time Department Queue Table */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                </span>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Trạng thái phòng khám & Hàng đợi thời gian thực
                </CardTitle>
              </div>
              <span className="text-[11px] text-slate-600 font-medium">Tự động làm mới mỗi 30s</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th scope="col" className="p-3 pl-4">Phòng khám & Phụ trách</th>
                      <th scope="col" className="p-3 text-center">Đang chờ</th>
                      <th scope="col" className="p-3">Đang xử lý / Ca hiện tại</th>
                      <th scope="col" className="p-3 text-center">TAT trung bình</th>
                      <th scope="col" className="p-3 text-center">Tình trạng tải</th>
                      <th scope="col" className="p-3 pr-4 text-right">Điều phối</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queues.map((q, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold rounded text-[11px]">
                              {q.roomCode}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">{q.room}</span>
                          </div>
                          <div className="text-slate-600 text-[11px] mt-0.5 pl-0.5">
                            Phụ trách: <b className="text-slate-800">{q.doctor}</b>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center justify-center font-mono font-bold text-xs text-clinic-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            {q.waiting} người
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800 text-xs">
                          {q.inExam}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800 text-xs">
                          {q.tat}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant={q.status === "Tải cao" ? "warn" : "success"} className="font-bold text-[10px]">
                            {q.status}
                          </Badge>
                        </td>
                        <td className="p-3 pr-4 text-right">
                          <Link href={q.href}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs font-bold text-clinic-blue border-blue-200 hover:bg-blue-50 hover:text-clinic-blue-hover shadow-xs"
                            >
                              {q.linkText} →
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Live Activity Stream & Clinic Load */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/80 p-3.5 border-b border-slate-200 flex flex-row items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-clinic-blue" />
                <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Nhật Ký Luồng Bệnh Nhân Real-Time
                </CardTitle>
              </div>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live
              </span>
            </CardHeader>
            <CardContent className="p-3.5 space-y-3">
              {liveEvents.map((ev, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="font-mono text-[11px] font-bold text-slate-600 shrink-0 mt-0.5">
                    {ev.time}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold text-slate-900 text-[11px] leading-tight truncate">
                      {ev.title}
                    </div>
                    <div className="text-[10px] text-slate-600 leading-tight">
                      {ev.sub}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick SLA Summary Widget */}
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50/40 via-white to-slate-50">
            <CardContent className="p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Công suất phòng khám
                </span>
                <span className="font-mono font-bold text-emerald-800 text-xs">78% Tải</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-clinic-blue rounded-full" style={{ width: "78%" }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>Khám LS: <b>72%</b></span>
                <span>Lab P.202: <b className="text-amber-800">85%</b></span>
                <span>ECG P.208: <b>55%</b></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
