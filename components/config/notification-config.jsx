import {
    FileText, ClipboardCheck, AlertCircle,
    UserPlus, MessageSquare, Database, CheckCircle2,
    Bell, Mail, UserCheck, ShieldAlert,
    LayoutDashboard,
    RefreshCw,
    Zap
} from "lucide-react";

export const getNotificationConfig = (type) => {
    const configs = {
        // Ta'lim va Imtihonlar
        TASK_ASSIGNED: {
            icon: ClipboardCheck,
            color: "text-blue-500",
            bg: "bg-blue-50",
            label: "Yangi topshiriq biriktirildi"
        },
        EXAM_OPENED: {
            icon: FileText,
            color: "text-purple-500",
            bg: "bg-purple-50",
            label: "Imtihon topshirish imkoniyati ochildi"
        },
        SUBMISSION_GRADED: {
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            label: "Natijangiz baholandi"
        },
        DEADLINE_APPROACHING: {
            icon: AlertCircle,
            color: "text-rose-500",
            bg: "bg-rose-50",
            label: "Topshiriq muddati tugamoqda"
        },

        // Foydalanuvchi va Guruhlar
        NEW_SUBMISSION: {
            icon: Mail,
            color: "text-orange-500",
            bg: "bg-orange-50",
            label: "Yangi javob kelib tushdi"
        },
        STUDENT_JOINED_GROUP: {
            icon: UserPlus,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
            label: "Guruhga yangi talaba qo'shildi"
        },
        CONTACT_REQUEST: {
            icon: MessageSquare,
            color: "text-sky-500",
            bg: "bg-sky-50",
            label: "Yangi aloqa so'rovi"
        },

        MOCK_TEST_PUBLISHED: {
            icon: LayoutDashboard,
            color: "text-amber-500",
            bg: "bg-amber-50",
            label: "Yangi Mock test e'lon qilindi"
        },
        EXAM_UPDATED: {
            icon: RefreshCw,
            color: "text-blue-500",
            bg: "bg-blue-50",
            label: "Imtihon ma'lumotlari yangilandi"
        },
        EXAM_RESULT_READY: {
            icon: Zap,
            color: "text-yellow-500",
            bg: "bg-yellow-50",
            label: "Imtihon natijalari tayyor"
        },

        // Tizim va Texnik
        MIGRATION_FAILED: {
            icon: Database,
            color: "text-red-500",
            bg: "bg-red-50",
            label: "Ma'lumotlar migratsiyasida xatolik"
        },
        SYSTEM_UPDATE: {
            icon: ShieldAlert,
            color: "text-amber-500",
            bg: "bg-amber-50",
            label: "Tizim yangilanishi"
        },
        ACCOUNT_VERIFIED: {
            icon: UserCheck,
            color: "text-teal-500",
            bg: "bg-teal-50",
            label: "Hisobingiz tasdiqlandi"
        }
    };

    return configs[type] || {
        icon: Bell,
        color: "text-slate-400",
        bg: "bg-slate-50",
        label: "Bildirishnoma"
    };
};