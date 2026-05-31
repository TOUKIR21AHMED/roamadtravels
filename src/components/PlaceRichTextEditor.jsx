import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

function PlaceRichTextEditor({ value, onChange, placeholder }) {
  return (
    <div className="place-rich-editor">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "বিস্তারিত লিখুন..."}
      />
    </div>
  );
}

export default PlaceRichTextEditor;
export { formats, modules };

