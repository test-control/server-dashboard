
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';

export function RichEditor ({editorState, setEditorState, showEditorState, setShowEditorState, onSave}) {

  const editorRef = useRef();

  const [lastState, setlastState] = React.useState(
    () => editorState,
  );

  const onBlur = () => {
    setShowEditorState(false);

    if(!lastState || lastState.getCurrentContent() !== editorState.getCurrentContent()) {
      onSave();
    }

    setlastState(editorState);
  }

  const onFocus = () => {
    setlastState(editorState);
    setShowEditorState(true);
  }

  const focus = () => {
    editorRef.current.focus();
  }

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  /*const onTab = e => {
    const maxDepth = 4;
    setEditorState(RichUtils.onTab(e, editorState, maxDepth));
  };*/
  const toggleBlockType = blockType => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };
  const toggleInlineStyle = inlineStyle => {
    setEditorState(
      RichUtils.toggleInlineStyle(editorState, inlineStyle)
    );
  };

  let className = 'RichEditor-editor';
  var contentState = null;

  if (editorState && editorState.getCurrentContent() && editorState.getCurrentContent().hasText()) {
    if (editorState.getCurrentContent().getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  return(
    <div className={(showEditorState)?'RichEditor-root RichEditor-root-active':'RichEditor-root RichEditor-root-inactive'}>
    {showEditorState &&
      <>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </>
    }
      <div className={className} onClick={onFocus}>
        <Editor
          inputRef={editorRef}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          placeholder="Start wrating..."
          spellCheck={true}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
}

/*
export class RichEditor extends React.Component {
  constructor(props) {
   super(props);
   this.state = {showEditor: false};
  }

  onChange = editorState => {
    this.props.onChange('editorState', editorState);
  };

  focus = () => this.refs.editor.focus();

  handleKeyCommand = command => {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  onTab = e => {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
  };
  toggleBlockType = blockType => {
    this.onChange(RichUtils.toggleBlockType(this.props.editorState, blockType));
  };
  toggleInlineStyle = inlineStyle => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle)
    );
  };

  onBlur = () => {
    this.setState({
      showEditor: false
    });
  }

  onFoucs = () => {
    this.setState({
      showEditor: true
    });
  }


  render() {

    const { editorState } = this.props;

    let className = 'RichEditor-editor';
    var contentState = null;

    if(editorState) {
       contentState = editorState.getCurrentContent()
    }

console.log(editorState)
    if (editorState && !editorState.hasText()) {
      if (editorState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return(
      <div className={(this.state.showEditor)?'RichEditor-root RichEditor-root-active':'RichEditor-root RichEditor-root-inactive'}>
      {this.state.showEditor &&
        <>
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
        </>
      }
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Start wrating..."
            ref="editor"
            spellCheck={true}
            onBlur={this.onBlur}
            onFocus={this.onFoucs}
          />
        </div>
      </div>
    );
  }
}
*/
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}
const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];
const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];
const InlineStyleControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
