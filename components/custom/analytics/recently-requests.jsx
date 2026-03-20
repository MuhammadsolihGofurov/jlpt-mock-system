import { Phone, Clock, ChevronRight, User, Building2, Calendar } from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";

const RecentRequests = ({ requests }) => {
  const intl = useIntl();
  // Statuslar uchun ranglar konfiguratsiyasi
  const statusConfig = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    CONTACTED: "bg-blue-50 text-blue-600 border-blue-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
    RESOLVED: "bg-green-50 text-green-600 border-green-100",
  };

  // Vaqtni formatlash (UTC muammosiz)
  const formatToExactTime = (dateStr) => {
    const date = new Date(dateStr);

    // UTC vaqtini olish (brauzer vaqtiga qaramasdan)
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year} | ${hours}:${minutes}`;
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">{intl.formatMessage({ id: "So'nggi so'rovlar" })}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">{intl.formatMessage({ id: "Sizga bog'lanishni kutayotgan mijozlar" })}</p>
        </div>
        <Link href={"/dashboard/requests"} className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-5 py-2.5 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-orange-100">
          {intl.formatMessage({ id: "Barchasini ko'rish" })}
        </Link>
      </div>

      <div className="space-y-4">
        {requests?.length > 0 ? (
          requests.map((request) => {
            const isIndividual = request.center_name === "Oddiy foydalanuvchi";

            return (
              <div
                key={request.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] border border-slate-50 hover:border-orange-100 hover:bg-orange-50/20 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  {/* Icon Wrapper */}
                  <div className="h-14 w-14 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-orange-200/50 transition-all duration-300">
                    {isIndividual ? <User size={24} /> : <Building2 size={24} className="text-orange-500" />}
                  </div>

                  {/* Info Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-orange-700 transition-colors leading-none">
                        {request.full_name}
                      </h4>
                      {isIndividual && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          {intl.formatMessage({ id: "Oddiy foydalanuvchi" })}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} className="text-slate-300" />
                        {request.phone_number}
                      </span>
                      <span className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                        <Clock size={14} className="text-slate-300" />
                        {formatToExactTime(request.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 mt-5 md:mt-0">
                  <div className={`text-[11px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${statusConfig[request.status] || statusConfig.PENDING}`}>
                    {request.status}
                  </div>

                  {/* <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200 group-hover:bg-orange-600 group-hover:shadow-orange-200 transition-all duration-300 active:scale-90">
                    <ChevronRight size={22} />
                  </button> */}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">{intl.formatMessage({ id: "Hozircha so'rovlar mavjud emas." })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRequests;