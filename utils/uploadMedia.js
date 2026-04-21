import { authAxios } from "@/utils/axios";

/**
 * Faylni /media-uploads/ ga yuboradi va file_key qaytaradi.
 * @param {File} file - yuklash kerak bo'lgan fayl
 * @param {string} target - backend targetidan biri:
 *   "jlpt_question" | "jlpt_group" | "jlpt_question_audio" | "jlpt_group_audio"
 *   "jft_question"  | "jft_shared_content" | "jft_question_audio" | "jft_shared_content_audio"
 *   "quiz_question"
 * @returns {Promise<string>} file_key (masalan: "tenants/abc/jft_mock_tests/...")
 */
export async function uploadMedia(file, target) {
  const formData = new FormData();
  formData.append("target", target);
  formData.append("file", file);

  const res = await authAxios.post("media-uploads/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.file_key;
}