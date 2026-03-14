import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

const InvitationSuccessModal = ({ invitations = [] }) => {
  const { closeModal } = useModal();
  const intl = useIntl();

  // Massivni tekshirish (Single yoki Bulk holati uchun)
  const items = Array.isArray(invitations) ? invitations : [invitations];

  const copyToClipboard = (text, messageId) => {
    navigator.clipboard.writeText(text);
    toast.success(intl.formatMessage({ id: messageId }));
  };

  const copyAllLinks = () => {
    const allLinks = items
      .map((item) => `${item.code}`)
      .join("\n");
    copyToClipboard(allLinks, "Barcha havolalar nusxalandi!");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-3xl text-green-600">
            <Check size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-heading">
              {intl.formatMessage({ id: "Taklifnomalar tayyor!" })}
            </h2>
            <p className="text-muted text-sm font-medium">
              {intl.formatMessage({
                id: "Kodlarni nusxalang va foydalanuvchilarga yuboring",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="group flex items-center justify-between bg-cream/50 border border-orange-100 p-4 rounded-2xl hover:border-primary transition-all"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-muted tracking-widest">
                Invite Code
              </span>
              <span className="text-lg font-mono font-bold text-heading tracking-wider">
                {item.code}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(item.code, "Kod nusxalandi!")}
                className="p-3 rounded-xl bg-white border border-orange-50 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Kodni nusxalash"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={() =>
                  copyToClipboard(
                    `${item.code}`,
                    "Havola nusxalandi!",
                  )
                }
                className="p-3 rounded-xl bg-white border border-orange-50 text-heading hover:bg-heading hover:text-white transition-all shadow-sm"
                title="Havolani nusxalash"
              >
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        <button
          onClick={copyAllLinks}
          className="flex-1 bg-heading text-white font-black px-6 py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <Copy size={20} />
          {intl.formatMessage({ id: "Barcha havolalarni nusxalash" })}
        </button>
        <button
          onClick={() => closeModal("INVITE_SUCCESS")}
          className="px-8 py-4 rounded-2xl font-bold text-muted bg-gray-50 hover:bg-gray-100 transition-all"
        >
          {intl.formatMessage({ id: "Yopish" })}
        </button>
      </div>
    </div>
  );
};

export default InvitationSuccessModal;
