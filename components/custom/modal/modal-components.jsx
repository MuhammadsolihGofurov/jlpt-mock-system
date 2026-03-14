import InvitationFormModal from "./details/admin/invite-code-modal";
import InvitationSuccessModal from "./details/admin/invite-success-modal";
import ConfirmModal from "./details/confirm-modal";
import AdminFormModal from "./details/owner/admin-form-modal";
import CenterFormModal from "./details/owner/center-form-modal";
import SubscriptionFormModal from "./details/owner/subscription-modal";

export const ModalComponents = {
  centerForm: CenterFormModal,
  CONFIRM_MODAL: ConfirmModal,
  ADMIN_FORM: AdminFormModal,
  SUBSCRIPTION_FORM: SubscriptionFormModal,
  INVITE_FORM: InvitationFormModal,
  INVITE_SUCCESS: InvitationSuccessModal,
};
