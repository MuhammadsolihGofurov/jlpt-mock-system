import MockFilterModal from "./details/admin-teacher/mock-filter-modal";
import MockFormModal from "./details/admin-teacher/mock-form-modal";
import SectionFormModal from "./details/admin-teacher/section-form";
import GroupFormModal from "./details/admin/group-form-modal";
import GroupMembersModal from "./details/admin/group-members-modal";
import InvitationFormModal from "./details/admin/invite-code-modal";
import InvitationSuccessModal from "./details/admin/invite-success-modal";
import MaterialFilterModal from "./details/admin/material-filter-modal";
import MaterialFormModal from "./details/admin/material-form-modal";
import UserFilterModal from "./details/admin/user-filter-modal";
import UserFormModal from "./details/admin/user-form-modal";
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
  USER_FORM: UserFormModal,
  USER_FILTER: UserFilterModal,
  GROUP_FORM: GroupFormModal,
  GROUP_MEMBERS: GroupMembersModal,
  MATERIAL_FORM: MaterialFormModal,
  MATERIAL_FILTER: MaterialFilterModal,
  MOCK_FORM: MockFormModal,
  MOCK_FILTER: MockFilterModal,
  SECTION_FORM: SectionFormModal,
};
