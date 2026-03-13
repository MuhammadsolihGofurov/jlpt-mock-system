export const getAnalyticsUrl = (role) => {
  if (!role) return null;

  const roles = {
    OWNER: "/analytics/owner/",
    CENTER_ADMIN: "/analytics/center-admin/",
    TEACHER: "/analytics/teacher/",
    STUDENT: "/analytics/student/",
  };

  return roles[role] || null;
};
