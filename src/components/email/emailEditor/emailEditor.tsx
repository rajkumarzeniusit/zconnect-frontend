import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import quill from "quill";
import "./emailEditor.scss";
import "./fileBlot";
import "./buttonBlot";
import "./dividerBlot";
import moment from "moment";
import { useSelector } from "react-redux";
interface EditorProps {
  readOnly: boolean;
  defaultValue: any;
  onTextChange: any;
  onSelectionChange: any;
  isReplyEmail: boolean;
  isSendNewEmail: boolean;
  emaildata: any;
  isReplyAllEmailState: boolean;
  isForwardEmail: boolean;
  isSelectedEmailTemplate: boolean;
  selectedEmailTemplateData: any;
  setSendAttachments: (attachments: any) => void;
}
let originalquill: any;
// Editor is an uncontrolled React component
const CustomToolbar = () => (
  <div id="toolbar">
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>
    <button className="ql-blockquote"></button>
    <button className="ql-code-block"></button>
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-list" value="check"></button>
    <button className="ql-link"></button>
    <button className="ql-image"></button>
    <button className="ql-video"></button>
    <button className="ql-formula"></button>
    <button className="ql-attachment">
      {/* <svg viewBox="0 0 18 18">
        <line className="ql-stroke" x1="7" x2="15" y1="7" y2="15"></line>
        <circle className="ql-fill" cx="4" cy="4" r="4"></circle>
      </svg> */}
      {/* <i className="fa-solid fa-file"></i> */}
      <i className="fa-solid fa-paperclip"></i>
    </button>
    <button className="ql-clean"></button>
    <select className="ql-size">
      <option value="small"></option>
      <option selected></option>
      <option value="large"></option>
      <option value="huge"></option>
    </select>
    <select className="ql-header" defaultValue="">
      <option value="1"></option>
      <option value="2"></option>
      <option value="3"></option>
      <option value="4"></option>
      <option value="5"></option>
      <option value="6"></option>
      <option value="" selected></option>
    </select>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="yellow"></option>
      <option value="purple"></option>
      <option value="#d0d1d2"></option>
      <option value="#000000" selected></option>
    </select>
    <select className="ql-background">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="yellow"></option>
      <option value="purple"></option>
      <option value="#d0d1d2"></option>
      <option value="#000000" selected></option>
    </select>
  </div>
);
const Editor = forwardRef<Quill, EditorProps>(
  (
    {
      readOnly,
      defaultValue,
      onTextChange,
      onSelectionChange,
      isReplyEmail,
      isSendNewEmail,
      emaildata,
      isReplyAllEmailState,
      isForwardEmail,
      isSelectedEmailTemplate,
      selectedEmailTemplateData,
      setSendAttachments,
    },
    ref: any
  ) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    console.log("email");

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);
    const readEditor: any = useSelector(
      (state: any) => state.emailFetch.readonly
    );
    console.log("readEditor", readEditor);

    useEffect(() => {
      const container: any = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      // const toolbarOptions = [
      //   ["bold", "italic", "underline", "strike"], // toggled buttons
      //   ["blockquote", "code-block"],
      //   ["link", "image", "video", "formula"],

      //   [{ header: 1 }, { header: 2 }], // custom button values
      //   [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      //   // [{ script: "sub" }, { script: "super" }], // superscript/subscript
      //   // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      //   // [{ direction: "rtl" }], // text direction

      //   [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      //   [{ header: [1, 2, 3, 4, 5, 6, false] }],

      //   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      //   // [{ font: [] }],
      //   // [{ align: [] }],

      //   ["clean"], // remove formatting button
      // ];
      // const options = {
      //   readOnly: false,
      //   modules: {
      //     toolbar: isReplyEmail === true ? toolbarOptions : "",
      //   },

      //   theme: "snow",
      // };
      const toolbarOptions = {
        container: "#toolbar",
        handlers: {
          attachment: attachmentHandler,
        },
      };
      const options = {
        readOnly: readEditor,
        modules: {
          toolbar:
            isReplyEmail === true ||
            isSendNewEmail === true ||
            isForwardEmail === true ||
            isReplyAllEmailState
              ? toolbarOptions
              : "",
        },
        theme: "snow",
        normalizeWhitespace: true,
      };

      const quill = new Quill(editorContainer, options);
      ref.current = quill;
      originalquill = quill;
      if (defaultValueRef.current) {
        // quill.setContents(defaultValueRef.current);
      }
      // Convert \r\n to new lines in Quill
      // const formattedEmailData = emaildata.replace(/\r\n/g, "\n");

      // Split the email data to handle both text and images
      // const parts = formattedEmailData.split(/\[([^\]]+)\]/);
      // const indexs = emaildata.indexOf(parts);
      // console.log("range index in  foor loop", indexs);
      // parts.forEach((part: any, index: number) => {
      //   console.log("parts is in images====>", part, index);

      //   if (index % 2 === 0) {
      //     // This is text
      //     quill.insertText(quill.getLength(), part);
      //   } else {
      //     // This is an image URL
      //     const index = emaildata.indexOf(part);
      //     const range = quill.getSelection(true);
      //     console.log("range index in after foor loop", index);

      //     quill.insertEmbed(index, "image", part);
      //   }
      // });












      const formattedEmailData = emaildata?.body?.replace(/\r\n/g, "\n");
      // Split the email data to handle both text and images
      const regex = /\[([^\]]+)\]/g;
      const linkRegex = /<([^>]+)>/g;
      let match: any;
      let lastIndex = 0;
      let currentIndex = 0;
      console.log("formattedemailddataa ======>", formattedEmailData);
      while ((match = regex.exec(formattedEmailData)) !== null) {
        const imagePath = match[1];
        console.log("imagespath to the old values", imagePath);

        const textBeforeImage = formattedEmailData.substring(
          lastIndex,
          match.index
        );

        // Insert the text before the image
        if (textBeforeImage) {
          quill.insertText(currentIndex, textBeforeImage);
          currentIndex += textBeforeImage.length;
        }
        // Insert the image
        // quill.insertEmbed(currentIndex, "image", imagePath);
        // currentIndex += 1;
        if (imagePath.startsWith("data:image")) {
          console.log("entered data:image")
          // Insert the image directly when it's base64 encoded
          quill.insertEmbed(currentIndex, "image", imagePath);
          currentIndex += 1;
        } 
        else if (/\.(jpeg|jpg|gif|png|svg)$/i.test(imagePath)) {
          console.log("png after")
          // Insert the image
          quill.insertEmbed(currentIndex, "image", imagePath);
          currentIndex += 1;
        } 
        else if (imagePath.startsWith("Image")) {
          console.log("png before")
          const base64StartIndex = imagePath.indexOf("data:image/png");
          const cleanImagePath = imagePath.substring(base64StartIndex); // Get substring from "data:image/png" onward
       console.log("base64StartIndex",base64StartIndex)
       console.log("cleanImagePath",cleanImagePath)
          // Insert the image directly when it's base64 encoded
          quill.insertEmbed(currentIndex, "image", cleanImagePath);
          currentIndex += 1;
      } 
      else if (imagePath.startsWith("image")) {
        console.log("png before")
        const base64StartIndex = imagePath.indexOf("data:image/png");
        const cleanImagePath = imagePath.substring(base64StartIndex); // Get substring from "data:image/png" onward
     console.log("base64StartIndex",base64StartIndex)
     console.log("cleanImagePath",cleanImagePath)
        // Insert the image directly when it's base64 encoded
        quill.insertEmbed(currentIndex, "image", cleanImagePath);
        currentIndex += 1;
    } 

    else {
      console.log("entered for url", imagePath);
    
      // Insert the URL as plain text
      quill.insertEmbed(currentIndex,'link', imagePath);
      currentIndex += imagePath.length;
    }
    
        
        // else {
        //   console.log("entered for url",imagePath)
        //   // Insert the URL as a link
        //   // quill.insertText(currentIndex, imagePath, "link", imagePath);


        //   const link = document.createElement("a");
        //   link.href = imagePath;
        //   link.textContent = imagePath;
        //   link.target = "_blanks"; // Open in new tab
        //   link.addEventListener("click", function (event) {
        //     // event.preventDefault(); // Prevent default link behavior
        //     window.open(link.href, "_blanks"); // Open link in new tab
        //   });

          
        //   quill.insertText(currentIndex, imagePath, {
        //     link: imagePath,
        //     target: "_blanks",
            
        //   });
        //   currentIndex += imagePath.length;
        // }
        lastIndex = regex.lastIndex;
      }
      // Insert any remaining text after the last image
      if (lastIndex < formattedEmailData?.length) {
       
        const remainingText = formattedEmailData?.substring(lastIndex);
        quill.insertText(currentIndex, remainingText);
      }

      
      quill.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
        // Call the provided onTextChangeRef function with the necessary arguments
        onTextChangeRef.current?.(delta, oldDelta, source);

        // Get the inserted text from the delta and process it
        if (source === "user") {
          // Get the text from the delta object
          delta.ops.forEach((op) => {
            if (op.insert && typeof op.insert === "string") {
         
              // Check if the inserted text contains any URLs or links
              const urlMatches = op.insert.match(
                /https?:\/\/[^\s/$.?#].[^\s]*/gi
              );

              // If URLs are found, format them as links in Quill
              if (urlMatches) {
               
                urlMatches.forEach((url) => {
                  // Find the index of the URL in the document
                  const index = quill.getText().indexOf(url);

                  // Format the text as a link
                  if (index !== -1) {
                    // quill.formatText(index, url.length, "urlButton", url);
                    quill.formatText(index, url.length, "link", url);
                  }
                });
              }
            }
          });
        }
      });

      ///////////////////////////////////////////

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });
      // const insertAttachmentsAsLinks = () => {

      // };
      // if (isReplyEmail) {
      //   if (isReplyEmail) {
      //     const qlEditorPTag = container.querySelector(".ql-editor p");
      //     if (qlEditorPTag) {
      //       const hrElement = document.createElement("hr");
      //       qlEditorPTag.parentNode.insertBefore(
      //         hrElement,
      //         qlEditorPTag.nextSibling
      //       );
      //     }
      //   }
      // }
      const toolbarExists = document.querySelector(".ql-toolbar.ql-snow");

      // If toolbar exists, add a class to the first <p> tag within ql-editor
      if (toolbarExists) {
        container.style.marginTop = "0px"; // Adjust the margin as needed

        // Insert three empty <p> tags at the beginning of the editor
        // for (let i = 0; i < 3; i++) {
        //   const emptyPTag = document.createElement("p");
        //   container
        //     .querySelector(".ql-editor")
        //     .insertBefore(
        //       emptyPTag,
        //       container.querySelector(".ql-editor").firstChild
        //     );
        // }

        if (isForwardEmail || isReplyEmail || isReplyAllEmailState) {
          if (isSelectedEmailTemplate) {
            quill.insertText(0, selectedEmailTemplateData);
          } else {
            for (let i = 0; i < 3; i++) {
              quill.insertText(0, "\n");
            }
          }
          const dividerPosition = isSelectedEmailTemplate
            ? selectedEmailTemplateData.length
            : 3;
          quill.insertEmbed(dividerPosition, "divider", true);

          const fromMail = "from@example.com"; // Replace with actual data
          const time = new Date().toLocaleString(); // Replace with actual time
          const toMailers = "to@example.com"; // Replace with actual data
          const ccMailers = "cc@example.com"; // Replace with actual data (optional)
          const subject = "testing emails"; // Replace with actual subject

          const pTags = [
            { label: "From: ", value: `${emaildata?.sender}` },
            {
              label: "Sent: ",
              value: `${moment(emaildata?.date).format("MMMM D, YYYY h:mm A")}`,
            },
            {
              label: "To: ",
              value: `${emaildata?.recipient
                ?.replace(/"/g, " ")
                ?.replace(/<[^>]*>/g, "")}`,
            },
            emaildata?.cc_email && {
              label: "CC: ",
              value: `${emaildata?.cc_email}`,
            },
            { label: "Subject: ", value: `${emaildata?.subject} \n` },
          ].filter(Boolean);

          let insertPosition: any = dividerPosition + 1;
          // if (isSelectedEmailTemplate) {
          //   insertPosition = selectedEmailTemplateData.length;
          // } else {
          //   insertPosition = 4;
          // }
          // Starting after the divider
          pTags.forEach((pTag: any) => {
            quill.insertText(insertPosition, pTag.label, { bold: true });
            insertPosition += pTag.label.length;
            quill.insertText(insertPosition, pTag.value + "\n");
            insertPosition += pTag.value.length + 1; // Including newline
          });
        }
        // Insert horizontal rule after the first three empty <p> tags

        // quill.insertEmbed(3, 'hr', true);

        // // Add border-top to the first <p> tag within ql-editor
        // const qlEditorPTag = container.querySelector(".ql-editor p");
        // if (qlEditorPTag) {
        //   qlEditorPTag.classList.add("show-border-top");
        // }

        // Apply border-top to the fourth <p> tag within ql-editor
        // const fourthPTag = container.querySelector(".ql-editor p:nth-child(4)");
        // if ((fourthPTag && isReplyEmail) || isForwardEmail) {
        //   fourthPTag.classList.add("apply-border-top"); // Adjust border properties as needed
        // }
      }
      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [
      ref,
      isReplyEmail,
      isSendNewEmail,
      isForwardEmail,
      isReplyAllEmailState,
      isSelectedEmailTemplate,
      selectedEmailTemplateData,
    ]);
    // useEffect(() => {
    //   const handleButtonClick = (event: MouseEvent) => {
    //     const target = event.target as HTMLElement;
    //     if (target && target.classList.contains("quill-button")) {
    //       const url = target.getAttribute("data-url");
    //       if (url) {
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.download = url.replace("http://localhost:8037/images/", "");
    //         link.click();
    //       }
    //     }
    //   };

    //   document.addEventListener("click", handleButtonClick);

    //   // return () => {
    //   //   document.removeEventListener("click", handleButtonClick);
    //   // };
    // }, []);
    const attachmentHandler = () => {
      const input: any = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "*/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileUrl = e.target.result;
            // console.log(
            //   "we are using into the original quill values in the  attchment handler values of the things  =====>",
            //   originalquill
            // );
            const link = URL.createObjectURL(file);
            const fileName = file.name;
            const range: any = originalquill.getSelection();
            if (range) {
              originalquill.insertEmbed(range.index, "file", {
                url: fileUrl,
                name: fileName,
              });
            } else {
              originalquill.insertEmbed(originalquill.getLength(), "file", {
                url: fileUrl,
                name: fileName,
              });
            }
            // setSendAttachments((prevState: any) => [
            //   ...prevState,
            //   { name: fileName, url: fileUrl },
            // ]);
            setSendAttachments((prevState: any) => [
              ...prevState,
              { name: fileName, url: fileUrl },
            ]);

            // const range: any = originalquill.getSelection();
            // originalquill.insertText(range.index, fileName, "link", link);
            // const range: any = originalquill.getSelection();
            // originalquill.insertEmbed(range.index, "image", fileUrl); // Assuming you want to handle the file as an image
          };
          reader.readAsDataURL(file);
        }
      };
    };
    return (
      <div className="quil-size">
        {(isReplyEmail ||
          isSendNewEmail ||
          isForwardEmail ||
          isReplyAllEmailState) && <CustomToolbar />}

        <div ref={containerRef}></div>
      </div>
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
