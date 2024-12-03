import Quill from 'quill';

const BlockEmbed:any = Quill.import('blots/block/embed');

class FileBlot extends BlockEmbed {
  static blotName = 'file';
  static tagName = 'div';

  static create(value: any) {
    const node = super.create();
    const link = document.createElement('a');
    link.setAttribute('href', value.url);
    link.setAttribute('target', '_blank');
    node.classList.add('file-button')
    link.textContent = value.name;
    node.appendChild(link);
    return node;
  }

  static value(node: any) {
    const link = node.querySelector('a');
    return {
      url: link.getAttribute('href'),
      name: link.textContent
    };
  }
}

Quill.register(FileBlot);
// import Quill from 'quill';
// const BlockEmbed:any = Quill.import('blots/block/embed');

// class FileBlot extends BlockEmbed {
//   static blotName = 'file';
//   static tagName = 'div';
//   static tagNames = "button"

//   static create(value: any) {
//     const node = super.create();
//     const link = document.createElement('a');
//     link.setAttribute('href', value.url);
//     link.setAttribute('target', '_blank');
//     const displayName = value.name.length > 30 ? `${value.name.slice(0, 27)}...` : value.name;
//     link.textContent = displayName;
//     // node.classList.add('file-button');
//     const icon = document.createElement('span');
//     icon.classList.add('file-icon');
//     if (value.name.endsWith('.pdf')) {
//       icon.innerHTML = '<i class="fas fa-file-pdf file-icon-pdf"></i>'; // Assuming Font Awesome icon
//     } else if(value.name.endsWith('.xlsx')){
//       icon.innerHTML = '<i class="fa-solid fa-file-excel file-icon-excel"></i>'; // Default file icon
//     }
//     else if(value.name.endsWith('.docx')){
//       icon.innerHTML = '<i class="fa-solid fa-file-word word-icon-color"></i>'; // Default file icon
//     }
//     const closeicon = document.createElement('span');
//     closeicon.classList.add('close-file-icon');
//     closeicon.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // Assuming Font Awesome icon
//     // Create text node for file name
//     node.classList.add('file-button');
//     node.appendChild(icon);
//     node.appendChild(link);
//     node.appendChild(closeicon);
//     // node.appendChild(link);
//     // node.appendChild(icon);
//     // node.appendChild(textNode);
//     closeicon.addEventListener('click', (event: Event) => {
//       event.stopPropagation(); // Prevent click event from propagating to the file node
//       node.remove(); // Remove the file node from the editor
//     });
//     node.addEventListener('click', (event:any) => {
//       // event.preventDefault();
//       window.open(value.url, '_blank');
//       // Trigger the download
//       const link = document.createElement('a');
//       link.href = value.url;
//       // link.download = value.name;
//       link.style.display = 'none';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     });
//     return node;
//   }

//   static value(node: any) {
//     const link = node.querySelector('a');
//     // if (!link) return { url: '', name: '' };
//     return {
//       url: link.getAttribute('href'),
//       name: link.textContent
//     };
//   }
// }
// FileBlot.blotName = 'file';
// FileBlot.tagName = 'a';
// Quill.register(FileBlot);
// import Quill from 'quill';

// const BlockEmbed:any = Quill.import('blots/block/embed');

// class FileBlot extends BlockEmbed {
//   static create(value: { url: string; name: string }) {
//     const node = super.create() as HTMLElement;
//     node.setAttribute('href', value.url);
//     node.setAttribute('target', '_blank');
//     node.classList.add('file-button');
//     node.textContent = value.name;
//     return node;
//   }

//   static value(node: HTMLElement) {
//     return {
//       url: node.getAttribute('href') || '',
//       name: node.textContent || '',
//     };
//   }
// }

// FileBlot.blotName = 'file';
// FileBlot.tagName = 'a';

// Quill.register(FileBlot);
// export default FileBlot;

