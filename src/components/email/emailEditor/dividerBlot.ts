import Quill from 'quill';

const BlockEmbed:any = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'hr';

  static create(value:any) {
    let node = super.create();
    return node;
  }
}

Quill.register(DividerBlot);
