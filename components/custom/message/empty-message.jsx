import { useIntl } from "react-intl";
import { UserPlus, Search, Inbox, Users, Ticket } from "lucide-react";

const icons = {
  users: Users,
  invitations: Ticket,
  search: Search,
  default: Inbox,
  userPlus: UserPlus,
};

const EmptyMessage = ({
  titleKey = "Ma'lumot topilmadi",
  descriptionKey = "Hozircha hech qanday ma'lumot mavjud emas",
  iconKey = "default",
}) => {
  const intl = useIntl();
  const Icon = icons[iconKey] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-orange-100/60 transition-all">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-primary/40 mb-5 shadow-inner">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg sm:text-xl font-black text-heading tracking-tight">
        {intl.formatMessage({ id: titleKey })}
      </h3>
      <p className="text-muted text-sm font-medium mt-1.5 max-w-[250px] text-center leading-relaxed">
        {intl.formatMessage({ id: descriptionKey })}
      </p>
    </div>
  );
};

export default EmptyMessage;
