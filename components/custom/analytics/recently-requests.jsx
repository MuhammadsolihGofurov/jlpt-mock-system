import { Phone, Mail, Clock, ChevronRight, User } from "lucide-react";

const RecentRequests = ({ requests }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900">So'nggi so'rovlar</h3>
          <p className="text-sm text-gray-500 mt-1">Sizga bog'lanishni kutayotgan mijozlar</p>
        </div>
        <button className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors">
          Barchasi
        </button>
      </div>

      <div className="space-y-4">
        {requests?.length > 0 ? (
          requests.map((request, idx) => (
            <div 
              key={request.id || idx}
              className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-3xl border border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Avatar / Icon */}
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-md transition-all">
                  <User size={20} />
                </div>
                
                {/* User Info */}
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                    {request.full_name || "Ism ko'rsatilmadi"}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" />
                      {request.phone_number}
                    </span>
                    <span className="hidden sm:flex items-center gap-1 border-l pl-3">
                      <Clock size={14} className="text-gray-400" />
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                  request.is_read ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-600'
                }`}>
                  {request.is_read ? "O'qildi" : "Yangi"}
                </span>
                
                <button className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 italic">Hozircha so'rovlar mavjud emas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRequests;