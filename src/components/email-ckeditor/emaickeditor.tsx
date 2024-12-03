import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.core.css";
const EmailCkEditor = () => {
  useEffect(() => {
    const quill = new Quill("#editor", {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
      },
      placeholder: "Compose an epic...",
      theme: "snow", // or 'bubble'
    });
  }, []);
  return (
    <div>
      <div id="editor"></div>
    </div>
  );
};

export default EmailCkEditor;
