import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownProps {
  content: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const components: Components = {
  code({ inline, className, children, ...props }: CodeProps) {
    const lang = className?.replace("language-", "") || "";

    if (inline) {
      return (
        <code
          className="font-mono text-[0.85em] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="my-3 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {lang && (
          <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wide">
              {lang}
            </span>
          </div>
        )}
        <pre className="px-4 py-3 overflow-x-auto">
          <code
            className="font-mono text-[13px] leading-relaxed text-gray-800 dark:text-gray-200"
            {...props}
          >
            {children}
          </code>
        </pre>
      </div>
    );
  },

  p({ children }) {
    return <p className="my-2 first:mt-0 last:mb-0">{children}</p>;
  },

  h1({ children }) {
    return (
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2 first:mt-0">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2 first:mt-0">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-3 mb-1.5 first:mt-0">
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 mb-1 first:mt-0">
        {children}
      </h4>
    );
  },

  ul({ children }) {
    return <ul className="my-2 pl-5 list-disc space-y-1">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="my-2 pl-5 list-decimal space-y-1">{children}</ol>;
  },
  li({ children }) {
    return <li className="text-gray-700 dark:text-gray-300">{children}</li>;
  },

  a({ href, children }) {
    return (
      <a
        href={href}
        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-2 decoration-purple-300 dark:decoration-purple-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-3 pl-3 border-l-2 border-purple-300 dark:border-purple-700 text-gray-600 dark:text-gray-400 italic">
        {children}
      </blockquote>
    );
  },

  hr() {
    return <hr className="my-4 border-gray-200 dark:border-gray-700" />;
  },

  strong({ children }) {
    return (
      <strong className="font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </strong>
    );
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },

  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>;
  },
  th({ children }) {
    return (
      <th className="px-3 py-1.5 text-left font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-3 py-1.5 font-mono text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        {children}
      </td>
    );
  },
};

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <div className="font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300 markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default React.memo(Markdown);
