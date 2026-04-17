import ExamFilterModal from "./details/admin-teacher/exam-filter-modal";
import ExamFormModal from "./details/admin-teacher/exam-form-modal";
import HomeworkFormModal from "./details/admin-teacher/homwork-form-modal";
import MockFilterModal from "./details/admin-teacher/mock-filter-modal";
import MockFormModal from "./details/admin-teacher/mock-form-modal";
import QuestionFormModal from "./details/admin-teacher/jlpt/question-form-modal";
import QuestionGroupFormModal from "./details/admin-teacher/jlpt/question-group-form-modal";
import QuizFilterModal from "./details/admin-teacher/quiz-filter-modal";
import QuizFormModal from "./details/admin-teacher/quiz-form-modal";
import ResultViewModal from "./details/admin-teacher/result-view-modal";
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
import NotificationDetailModal from "./details/notification-detail-modal";
import AdminFormModal from "./details/owner/admin-form-modal";
import CenterFormModal from "./details/owner/center-form-modal";
import ContactRequestStatusModal from "./details/owner/contact-request-modal";
import SubscriptionFormModal from "./details/owner/subscription-modal";
import ServiceDetailModal from "./details/service-modal";
import FlashcardPracticeModal from "./details/all/flashcard-practice-modal";
import CategoryFormModal from "./details/admin/category-form-modal";
import JFTMockFormModal from "./details/admin-teacher/jft/jft-form-modal";
import JFTQuestionGroupFormModal from "./details/admin-teacher/jft/jft-question-group-modal";
import { JFTQuestionFormModal } from "./details/admin-teacher/jft";
import CheckedConfirmModal from "./details/checked-confirm-modal";

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
  QUESTION_GROUP: QuestionGroupFormModal,
  QUESTION_FORM: QuestionFormModal,
  EXAM_FORM: ExamFormModal,
  EXAM_FILTER: ExamFilterModal,
  HOMEWORK_FORM: HomeworkFormModal,
  QUIZ_FORM: QuizFormModal,
  QUIZ_FILTER: QuizFilterModal,
  RESULT_VIEW: ResultViewModal,
  NOTIFY_MODAL: NotificationDetailModal,
  CONTACT_FORM: ContactRequestStatusModal,
  SERVICE_MODAL: ServiceDetailModal,
  PRACTICE_MODAL: FlashcardPracticeModal,
  CATEGORY_MODAL: CategoryFormModal,
  JFT_MOCK_FORM: JFTMockFormModal,
  JFT_QUESTION_GROUP: JFTQuestionGroupFormModal,
  JFT_QUESTION_FORM: JFTQuestionFormModal,
  CHECKED_CONFIRM_MODAL: CheckedConfirmModal
};
