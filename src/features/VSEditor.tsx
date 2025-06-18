import { Editor } from '@monaco-editor/react';
import { useRef, useState } from 'react';
import LeftRibbon from './LeftRibbon';
import Explorer from './Explorer';

const VSEditor = () => {
  const editorRef = useRef<any>(null);
  const [theme, setTheme] = useState<'light' | 'vs-dark'>('light');

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {LeftRibbon(theme,setTheme)}
      <Explorer/>
      <div style={{ flexGrow: 1 }}>
        <Editor
          height="100vh"
          width="100vw"
          theme={theme}
          defaultLanguage="java"
          defaultValue="// Write your code here"
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
};

export default VSEditor;
