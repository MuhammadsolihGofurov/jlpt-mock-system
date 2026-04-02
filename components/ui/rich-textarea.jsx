import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useIntl } from "react-intl";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RichTextarea = ({ label, value, onChange, error, placeholder }) => {
    // Ranglar palitrasini xohlasangiz cheklashingiz yoki kengaytirishingiz mumkin
    const colors = [
        "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
        "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
        "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285e0"
    ];
    const intl = useIntl();

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            // Rang va orqa fon rangi tugmalari
            [{ color: colors }, { background: colors }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "list",
        "bullet",
        "align",
    ];

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                    {intl.formatMessage({ id: label })}
                </label>
            )}
            <div className={`rich-editor-wrapper ${error ? "border-red-500" : "border-slate-100"}`}>
                <ReactQuill
                    theme="snow"
                    value={value || ""}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={intl.formatMessage({ id: placeholder })}
                    className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-200"
                />
            </div>
            {error && <span className="text-xs font-bold text-red-500 ml-1">{error.message}</span>}

            <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          min-height: 180px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          background: #f8fafc;
          padding: 10px 14px !important;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
        /* Rang tanlagich (picker) dizaynini biroz to'g'irlash */
        .ql-snow .ql-picker.ql-color-picker .ql-picker-label svg, 
        .ql-snow .ql-picker.ql-icon-picker .ql-picker-label svg {
            width: 18px;
        }
        .ql-editor {
          min-height: 180px;
          color: #1e293b;
          line-height: 1.6;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
      `}</style>
        </div>
    );
};

export default RichTextarea;