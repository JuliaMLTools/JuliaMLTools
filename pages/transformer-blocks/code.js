import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export default function CodeBlock(props) {
    const {customStyle = {}} = props;
    const codeString = '(num) => num + 1 a';
    return (
        <SyntaxHighlighter language="julia" style={a11yDark} customStyle={customStyle}>
            {props.code}
        </SyntaxHighlighter>
    );
};