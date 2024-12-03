// import Quill from 'quill';

// // Define the type for the value object
// interface ButtonBlotValue {
//   url: string;
//   text: string;
// }

// // Extend the Quill Inline blot
// const InlineBlot:any = Quill.import('blots/inline');

// class ButtonBlot extends InlineBlot {
//   static blotName = 'button';
//   static tagName = 'button';

//   static create(value: ButtonBlotValue): HTMLElement {
//     const node = super.create() as HTMLElement;
//     node.setAttribute('data-url', value.url);
//     node.innerHTML = value.text;
//     node.className = 'quill-button';
//     return node;
//   }

//   static formats(node: HTMLElement): ButtonBlotValue {
//     return {
//       url: node.getAttribute('data-url') || '',
//       text: node.innerHTML || '',
//     };
//   }

//   format(name: string, value: ButtonBlotValue) {
//     if (name === 'button' && value) {
//       this.domNode.setAttribute('data-url', value.url);
//       this.domNode.innerHTML = value.text;
//     } else {
//       super.format(name, value);
//     }
//   }
// }

// // Register the custom blot with Quill
// Quill.register(ButtonBlot);
import Quill from 'quill';
import { InlineBlot } from 'parchment';

// Importing the necessary types from Quill
const Inline = Quill.import('blots/inline') as typeof InlineBlot;

class UrlButtonBlot extends Inline {
  static create(value: string): HTMLElement {
    const node = super.create() as HTMLElement;
    node.setAttribute('href', value);
    node.setAttribute('target', '_blank');
    node.classList.add('url-button');
    node.textContent = value;
    return node;
  }

  static formats(node: HTMLElement): string | null {
    return node.getAttribute('href');
  }
}

UrlButtonBlot.blotName = 'link';
UrlButtonBlot.tagName = 'a';

Quill.register(UrlButtonBlot);

