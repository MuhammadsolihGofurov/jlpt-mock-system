export const mockTypes = {
    jlpt: {
        list: `/mock-tests/`,
        home_page: "/dashboard/mocks",
        section: `/test-sections/`,
        section_types: [{
                value: "VOCAB",
                label: "Vocabulary"
            },
            {
                value: "GRAMMAR_READING",
                label: "Reading"
            },
            {
                value: "LISTENING",
                label: "Listening"
            },
        ],
        question_group: `question-groups/`,
        question_group_query: "section",
        question_group_type: "group",
        image: true,
        question: `questions/`,
        total_duration: false,
        without_group_questions: false,
    },
    jft: {
        list: "/jft-mock-tests/",
        home_page: "/dashboard/mocks/jft",
        section: `/jft-sections/`,
        section_types: [{
                value: "SCRIPT_VOCAB",
                label: "Script & Vocabulary"
            },
            {
                value: "CONVERSATION_EXPRESSION",
                label: "Conversation & Expression"
            },
            {
                value: "LISTENING",
                label: "Listening Comprehension"
            },
            {
                value: "READING",
                label: "Reading Comprehension"
            },
        ],
        question_group: `jft-shared-contents/`,
        question_group_query: "section",
        question_group_type: "shared_content",
        image: false,
        question: `jft-questions/`,
        total_duration: true,
        without_group_questions: true,
    }
}