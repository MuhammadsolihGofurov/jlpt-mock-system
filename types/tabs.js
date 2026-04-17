import { Book, BookOpen, FileQuestion, FileText, GraduationCap } from "lucide-react";

export const mockTabs = [{
        id: "exam",
        label: "JLPT",
        path: "/dashboard/mocks",
        icon: <BookOpen size = {
            20
        }
        />,
    },
    {
        id: "jft",
        label: "JFT",
        path: "/dashboard/mocks/jft",
        icon: <Book size = {
            20
        }
        />,
    },
    {
        id: "homework",
        label: "Quizlar",
        path: "/dashboard/mocks/quiz",
        icon: <FileQuestion size = {
            20
        }
        />,
    },
];


export const examTabs = [
                    {
                        id: "exam-jlpt",
                        label: "JLPT",
                        path: "/dashboard/assignments/exam-jlpt",
                        icon: <GraduationCap size={20} />,
                    },
                    {
                        id: "exam-jft",
                        label: "JFT",
                        path: "/dashboard/assignments/exam-jft",
                        icon: <GraduationCap size={20} />,
                    },
                    {
                        id: "homework",
                        label: "Vazifalar",
                        path: "/dashboard/assignments/homework",
                        icon: <FileText size={20} />,
                    },
                ]